import { useState } from 'react';
import type { Project } from '../../types';
import Lightbox from '../../components/common/Lightbox';

interface ProjectDetailPanelProps {
  project: Project | null;
  onClose: () => void;
}

const sdgColors: Record<number, string> = {
  1: '#E5243B',
  2: '#DDA63A',
  3: '#4C9F38',
  4: '#C5192D',
  5: '#FF3A21',
  6: '#26BDE2',
  7: '#FCC30B',
  8: '#A21942',
  9: '#FD6925',
  10: '#DD1367',
  11: '#FD9D24',
  12: '#BF8B2E',
  13: '#3F7E44',
  14: '#0A97D9',
  15: '#56C02B',
  16: '#00689D',
  17: '#19486A',
};

export default function ProjectDetailPanel({ project, onClose }: ProjectDetailPanelProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!project) return null;

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // Could use a toast notification here
    alert('Project link copied to clipboard!');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Side Panel */}
      <div className="fixed right-0 top-0 h-full w-full lg:w-[480px] bg-white shadow-2xl z-50 overflow-y-auto text-gray-900 border-l border-gray-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold text-gray-900">Project Details</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-primary-600"
              title="Share Project"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-8">
          {/* Images Carousel */}
          {project.imageUrls && project.imageUrls.length > 0 ? (
            <div className="space-y-2">
              <img
                src={project.imageUrls[0]}
                alt={project.projectName}
                className="w-full h-64 object-cover rounded-lg border border-gray-200 cursor-zoom-in hover:opacity-95 transition-opacity"
                onClick={() => handleImageClick(0)}
                onError={(e) => {
                  console.error("Failed to load image:", project.imageUrls[0]);
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
              {project.imageUrls.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {project.imageUrls.slice(1).map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`${project.projectName} ${idx + 2}`}
                      className="w-20 h-20 object-cover rounded border border-gray-200 cursor-zoom-in hover:opacity-95 transition-opacity flex-shrink-0"
                      onClick={() => handleImageClick(idx + 1)}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
             <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                <span className="text-gray-400 font-medium">No Images Available</span>
             </div>
          )}

          {/* Title & Status */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{project.projectName}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                  project.projectStatus === 'Implemented'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : project.projectStatus === 'In Progress'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                {project.projectStatus}
              </span>
              <span className="text-sm text-gray-500 px-2 border-l border-gray-200">{project.uiaRegion}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <svg
              className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div>
              <p className="font-medium text-gray-900">
                {project.city}, {project.country}
              </p>
              {project.latitude && project.longitude && (
                <p className="text-sm text-gray-500 mt-1 font-mono">
                  {project.latitude.toFixed(4)}, {project.longitude.toFixed(4)}
                </p>
              )}
            </div>
          </div>

          {/* Organization */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              Organization
            </h4>
            <p className="font-medium text-gray-900">{project.organizationName}</p>
            <p className="text-sm text-gray-600 mt-1">{project.contactPerson}</p>
            <a
              href={`mailto:${project.contactEmail}`}
              className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block transition-colors"
            >
              {project.contactEmail}
            </a>
          </div>

          {/* Brief Description */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              Brief Description
            </h4>
            <p className="text-gray-700 leading-relaxed">{project.briefDescription}</p>
          </div>

          {/* Detailed Description */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
              Detailed Description
            </h4>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
              {project.detailedDescription}
            </p>
          </div>

          {/* Funding */}
          {(project.fundingNeeded > 0 || project.fundingSpent > 0) && (
            <div className="bg-primary-50 rounded-lg p-4 border border-primary-100">
              <h4 className="text-xs font-semibold text-primary-700 uppercase tracking-widest mb-3">
                Funding
              </h4>
              <div className="space-y-2">
                {project.fundingNeeded > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Needed:</span>
                    <span className="font-mono font-semibold text-gray-900">
                      ${project.fundingNeeded.toLocaleString()}
                    </span>
                  </div>
                )}
                {project.fundingSpent > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Spent:</span>
                    <span className="font-mono font-semibold text-green-600">
                      ${project.fundingSpent.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SDGs */}
          {project.sdgs && project.sdgs.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                Sustainable Development Goals
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.sdgs.map((sdg) => (
                  <div
                    key={sdg}
                    className="flex items-center justify-center w-12 h-12 rounded font-bold text-white text-sm shadow-sm ring-1 ring-black/5 hover:shadow-md transition-all cursor-help"
                    style={{ backgroundColor: sdgColors[sdg] }}
                    title={`SDG ${sdg}`}
                  >
                    {sdg}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Typologies */}
          {project.typologies && project.typologies.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                Project Typologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.typologies.map((typology, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                  >
                    {typology}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Success Factors */}
          {project.successFactors && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                Success Factors
              </h4>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                  {project.successFactors}
                </p>
              </div>
            </div>
          )}

          {/* Requirements */}
          {((project.fundingRequirements && project.fundingRequirements.length > 0) ||
            (project.governmentRequirements && project.governmentRequirements.length > 0) ||
            (project.otherRequirements && project.otherRequirements.length > 0)) && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                Key Requirements
              </h4>
              <div className="space-y-4">
                {project.fundingRequirements && project.fundingRequirements.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-primary-600 mb-2">
                      Funding
                    </p>
                    <ul className="space-y-1">
                      {project.fundingRequirements.map((req, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-primary-500 mt-1.5 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {project.governmentRequirements && project.governmentRequirements.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-primary-600 mb-2">
                      Government & Regulatory
                    </p>
                    <ul className="space-y-1">
                      {project.governmentRequirements.map((req, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-primary-500 mt-1.5 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {project.otherRequirements && project.otherRequirements.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-primary-600 mb-2">
                      Other
                    </p>
                    <ul className="space-y-1">
                      {project.otherRequirements.map((req, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-primary-500 mt-1.5 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Lightbox
        images={project.imageUrls}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((i) => (i > 0 ? i - 1 : project.imageUrls.length - 1))}
        onNext={() => setLightboxIndex((i) => (i < project.imageUrls.length - 1 ? i + 1 : 0))}
      />
    </>
  );
}

