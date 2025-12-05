import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { projectsApi, type ProjectCreate } from '../../services/api/projects';
import {
  UIA_REGIONS,
  PROJECT_STATUSES,
  TYPOLOGIES,
  FUNDING_REQUIREMENTS,
  GOVERNMENT_REQUIREMENTS,
  OTHER_REQUIREMENTS,
  SDGS,
} from '../../utils/constants';

export default function SubmitProject() {
  const [searchParams] = useSearchParams();
  const editToken = searchParams.get('edit_token');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imageInput, setImageInput] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<ProjectCreate>({
    defaultValues: {
      sdgs: [],
      typologies: [],
      funding_requirements: [],
      government_requirements: [],
      other_requirements: [],
      funding_needed: 0,
    }
  });

  useEffect(() => {
    if (editToken) {
      loadProjectForEdit(editToken);
    }
  }, [editToken]);

  const loadProjectForEdit = async (token: string) => {
    setIsLoading(true);
    try {
      const project = await projectsApi.getByToken(token);
      // Populate image input
      if (project.image_urls) {
        setImageInput(project.image_urls.join('\n'));
      }
      
      // Reset form with project data
      reset({
        project_name: project.project_name,
        organization_name: project.organization_name,
        contact_person: project.contact_person,
        contact_email: project.contact_email,
        project_status: project.project_status,
        funding_needed: project.funding_needed,
        uia_region: project.uia_region,
        city: project.city,
        country: project.country,
        latitude: project.latitude,
        longitude: project.longitude,
        brief_description: project.brief_description,
        detailed_description: project.detailed_description,
        success_factors: project.success_factors,
        typologies: project.typologies,
        funding_requirements: project.funding_requirements,
        government_requirements: project.government_requirements,
        other_requirements: project.other_requirements,
        other_requirement_text: project.other_requirement_text,
        sdgs: project.sdgs,
        image_urls: project.image_urls
      });
    } catch (err: any) {
      console.error('Error loading project:', err);
      setSubmitError("Invalid or expired edit link. Please check the URL.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedSDGs = watch('sdgs');

  const onSubmit: SubmitHandler<ProjectCreate> = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Require captcha for new submissions only
    if (!editToken && !captchaToken) {
      setSubmitError("Please verify that you are not a robot.");
      setIsSubmitting(false); // Stop submitting state
      return;
    }

    try {
      // Process image URLs from string input
      const urls = imageInput
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);
      
      const payload = {
        ...data,
        image_urls: urls,
        // Ensure numbers are parsed
        funding_needed: Number(data.funding_needed),
        latitude: data.latitude ? Number(data.latitude) : undefined,
        longitude: data.longitude ? Number(data.longitude) : undefined,
        captcha_token: captchaToken || undefined,
      };

      if (editToken) {
        await projectsApi.updateByToken(editToken, payload);
      } else {
        await projectsApi.submit(payload);
      }
      
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmitError(err.response?.data?.detail || 'An error occurred while submitting the project.');
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSDG = (id: number) => {
    const current = selectedSDGs || [];
    if (current.includes(id)) {
      setValue('sdgs', current.filter(s => s !== id));
    } else {
      setValue('sdgs', [...current, id]);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    reset();
    setImageInput('');
    setCaptchaToken(null);
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-mapbox-black flex items-center justify-center text-white">
        Loading project data...
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-mapbox-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-mapbox-card border border-mapbox-border rounded-xl p-8 text-center shadow-2xl">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-900/30 border border-green-900/50 mb-6">
            <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {editToken ? 'Update Received' : 'Submission Received'}
          </h2>
          <p className="text-mapbox-gray mb-8">
            {editToken 
              ? 'Your project updates have been submitted for re-review.' 
              : 'Thank you for contributing to the Atlas 3+3. Your project has been submitted for review by UIA experts.'}
            {' '}You will be notified once it is published.
          </p>
          <div className="flex flex-col space-y-3">
            <Link
              to="/dashboard"
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              View Atlas
            </Link>
            {!editToken && (
              <button
                onClick={handleReset}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-mapbox-border rounded-md shadow-sm text-sm font-medium text-mapbox-gray bg-transparent hover:text-white hover:border-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Submit Another Project
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mapbox-black text-mapbox-light py-12 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-white">
            {editToken ? 'Update Project' : 'Submit a Project'}
          </h1>
          <p className="mt-2 text-mapbox-gray">
            {editToken 
              ? 'Make necessary changes to your project submission below.' 
              : 'Share your sustainable development project with the global community. All submissions are reviewed by UIA experts before publication.'}
          </p>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded-md">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-mapbox-card p-8 rounded-xl shadow-xl border border-mapbox-border">
          
          {/* Contact Information */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-mapbox-border">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-mapbox-gray mb-1">Organization Name</label>
                <input
                  type="text"
                  {...register('organization_name', { required: 'Organization name is required' })}
                  className="block w-full rounded-md border-mapbox-border bg-mapbox-dark text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5"
                />
                {errors.organization_name && <p className="mt-1 text-sm text-red-400">{errors.organization_name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-mapbox-gray mb-1">Contact Person</label>
                <input
                  type="text"
                  {...register('contact_person', { required: 'Contact person is required' })}
                  className="block w-full rounded-md border-mapbox-border bg-mapbox-dark text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5"
                />
                {errors.contact_person && <p className="mt-1 text-sm text-red-400">{errors.contact_person.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-mapbox-gray mb-1">Contact Email</label>
                <input
                  type="email"
                  {...register('contact_email', { required: 'Email is required' })}
                  className="block w-full rounded-md border-mapbox-border bg-mapbox-dark text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5"
                />
                {errors.contact_email && <p className="mt-1 text-sm text-red-400">{errors.contact_email.message}</p>}
              </div>
            </div>
          </section>

          {/* Project Basics */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-mapbox-border">
              Project Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-mapbox-gray mb-1">Project Name</label>
                <input
                  type="text"
                  {...register('project_name', { required: 'Project name is required' })}
                  className="block w-full rounded-md border-mapbox-border bg-mapbox-dark text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5"
                />
                {errors.project_name && <p className="mt-1 text-sm text-red-400">{errors.project_name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-mapbox-gray mb-1">Project Status</label>
                <select
                  {...register('project_status', { required: 'Status is required' })}
                  className="block w-full rounded-md border-mapbox-border bg-mapbox-dark text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5"
                >
                  <option value="">Select Status</option>
                  {PROJECT_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                {errors.project_status && <p className="mt-1 text-sm text-red-400">{errors.project_status.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-mapbox-gray mb-1">Funding Needed (USD)</label>
                <input
                  type="number"
                  {...register('funding_needed', { min: 0 })}
                  className="block w-full rounded-md border-mapbox-border bg-mapbox-dark text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5"
                />
              </div>
            </div>
          </section>

          {/* Location */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-mapbox-border">
              Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-mapbox-gray mb-1">UIA Region</label>
                <select
                  {...register('uia_region', { required: 'Region is required' })}
                  className="block w-full rounded-md border-mapbox-border bg-mapbox-dark text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5"
                >
                  <option value="">Select Region</option>
                  {UIA_REGIONS.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                {errors.uia_region && <p className="mt-1 text-sm text-red-400">{errors.uia_region.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-mapbox-gray mb-1">City</label>
                <input
                  type="text"
                  {...register('city', { required: 'City is required' })}
                  className="block w-full rounded-md border-mapbox-border bg-mapbox-dark text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mapbox-gray mb-1">Country</label>
                <input
                  type="text"
                  {...register('country', { required: 'Country is required' })}
                  className="block w-full rounded-md border-mapbox-border bg-mapbox-dark text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mapbox-gray mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  {...register('latitude', { min: -90, max: 90 })}
                  className="block w-full rounded-md border-mapbox-border bg-mapbox-dark text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mapbox-gray mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  {...register('longitude', { min: -180, max: 180 })}
                  className="block w-full rounded-md border-mapbox-border bg-mapbox-dark text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5"
                />
              </div>
            </div>
          </section>

          {/* Description */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-mapbox-border">
              Description
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-mapbox-gray mb-1">Brief Description (Summary)</label>
                <textarea
                  rows={3}
                  {...register('brief_description', { required: 'Brief description is required' })}
                  className="block w-full rounded-md border-mapbox-border bg-mapbox-dark text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5"
                />
                {errors.brief_description && <p className="mt-1 text-sm text-red-400">{errors.brief_description.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-mapbox-gray mb-1">Detailed Description</label>
                <textarea
                  rows={6}
                  {...register('detailed_description', { required: 'Detailed description is required' })}
                  className="block w-full rounded-md border-mapbox-border bg-mapbox-dark text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-mapbox-gray mb-1">Success Factors</label>
                <textarea
                  rows={4}
                  {...register('success_factors', { required: 'Success factors are required' })}
                  className="block w-full rounded-md border-mapbox-border bg-mapbox-dark text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5"
                  placeholder="What makes this project successful? (e.g. Community involvement, innovative technology...)"
                />
              </div>
            </div>
          </section>

          {/* SDGs */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-mapbox-border">
              Sustainable Development Goals
            </h2>
            <p className="text-sm text-mapbox-gray mb-4">Select all that apply.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {SDGS.map(sdg => (
                <div
                  key={sdg.id}
                  onClick={() => toggleSDG(sdg.id)}
                  className={`cursor-pointer p-3 rounded-lg border transition-all ${selectedSDGs?.includes(sdg.id)
                      ? 'border-transparent ring-2 ring-primary-500 bg-primary-900/20'
                      : 'border-mapbox-border bg-mapbox-dark hover:border-primary-500/50'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div 
                      className="w-8 h-8 flex items-center justify-center rounded-full text-white font-bold"
                      style={{ backgroundColor: sdg.color }}
                    >
                      {sdg.id}
                    </div>
                    <span className="text-xs font-medium text-white">{sdg.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Typologies & Requirements */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-mapbox-border">
              Categorization & Requirements
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-3">Project Typologies</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {TYPOLOGIES.map(type => (
                    <label key={type} className="inline-flex items-center p-2 rounded hover:bg-mapbox-dark transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        value={type}
                        {...register('typologies')}
                        className="rounded border-mapbox-border bg-mapbox-dark text-primary-600 focus:ring-primary-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-mapbox-gray">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-3">Funding Requirements</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {FUNDING_REQUIREMENTS.map(req => (
                    <label key={req} className="inline-flex items-center p-2 rounded hover:bg-mapbox-dark transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        value={req}
                        {...register('funding_requirements')}
                        className="rounded border-mapbox-border bg-mapbox-dark text-primary-600 focus:ring-primary-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-mapbox-gray">{req}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-3">Government Requirements</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {GOVERNMENT_REQUIREMENTS.map(req => (
                    <label key={req} className="inline-flex items-center p-2 rounded hover:bg-mapbox-dark transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        value={req}
                        {...register('government_requirements')}
                        className="rounded border-mapbox-border bg-mapbox-dark text-primary-600 focus:ring-primary-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-mapbox-gray">{req}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-3">Other Requirements</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {OTHER_REQUIREMENTS.map(req => (
                    <label key={req} className="inline-flex items-center p-2 rounded hover:bg-mapbox-dark transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        value={req}
                        {...register('other_requirements')}
                        className="rounded border-mapbox-border bg-mapbox-dark text-primary-600 focus:ring-primary-500 h-4 w-4"
                      />
                      <span className="ml-2 text-sm text-mapbox-gray">{req}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-mapbox-gray mb-1">Other Requirement Details</label>
                <input
                  type="text"
                  {...register('other_requirement_text')}
                  className="block w-full rounded-md border-mapbox-border bg-mapbox-dark text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5"
                  placeholder="Specify any other requirements..."
                />
              </div>
            </div>
          </section>

          {/* Media */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-6 pb-2 border-b border-mapbox-border">
              Media
            </h2>
            <div>
              <label className="block text-sm font-medium text-mapbox-gray mb-1">Image URLs</label>
              <p className="text-xs text-mapbox-gray mb-2">Enter one URL per line. These will be displayed in the project gallery.</p>
              <textarea
                rows={4}
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                className="block w-full rounded-md border-mapbox-border bg-mapbox-dark text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2.5 font-mono"
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              />
            </div>
          </section>
          
          {/* Captcha */}
          {!editToken && (
            <div className="pt-4 flex justify-center">
                <ReCAPTCHA
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    onChange={(token) => setCaptchaToken(token)}
                    theme="dark"
                />
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
