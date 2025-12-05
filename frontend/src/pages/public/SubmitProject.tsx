import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { projectsApi, type ProjectCreate } from '../../services/api/projects';
import ProjectForm from '../../components/forms/ProjectForm';

export default function SubmitProject() {
  const [searchParams] = useSearchParams();
  const editToken = searchParams.get('edit_token');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<Partial<ProjectCreate> | undefined>(undefined);

  useEffect(() => {
    if (editToken) {
      loadProjectForEdit(editToken);
    }
  }, [editToken]);

  const loadProjectForEdit = async (token: string) => {
    setIsLoading(true);
    try {
      const project = await projectsApi.getByToken(token);
      setInitialValues({
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
        image_urls: project.image_urls,
        gdpr_consent: project.gdpr_consent
      });
    } catch (err: any) {
      console.error('Error loading project:', err);
      setSubmitError("Invalid or expired edit link. Please check the URL.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: ProjectCreate) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (editToken) {
        await projectsApi.updateByToken(editToken, data);
      } else {
        await projectsApi.submit(data);
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

  const handleReset = () => {
    setIsSuccess(false);
    setInitialValues(undefined);
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

        <ProjectForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
          isPublicSubmission={!editToken} // Only require checks if not editing via token
          submitLabel={editToken ? 'Update Project' : 'Submit Project'}
        />
      </div>
    </div>
  );
}