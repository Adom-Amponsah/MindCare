import React from 'react';
import { RESOURCE_CATEGORIES } from '../services/resourceService';

/**
 * Component to display resource suggestions in chat
 */
const ResourceSuggestion = ({ suggestion }) => {
  if (!suggestion || !suggestion.shouldSuggest || !suggestion.resources || suggestion.resources.length === 0) {
    return null;
  }

  const { introduction, resources, type } = suggestion;

  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
      <p className="font-medium text-blue-800 mb-3">{introduction}</p>
      <div className="space-y-3">
        {resources.map((resource) => (
          <div key={resource.id} className="bg-white p-3 rounded border border-blue-100">
            {type === RESOURCE_CATEGORIES.ARTICLES && (
              <>
                <h4 className="font-semibold text-blue-900">{resource.title}</h4>
                <p className="text-sm text-gray-700 mt-1">{resource.description}</p>
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                >
                  Read more
                </a>
              </>
            )}

            {type === RESOURCE_CATEGORIES.COMMUNITY && (
              <>
                <h4 className="font-semibold text-blue-900">{resource.title}</h4>
                <p className="text-sm text-gray-700 mt-1">{resource.description}</p>
                {resource.location && (
                  <p className="text-xs text-gray-600 mt-1">Location: {resource.location}</p>
                )}
                {resource.contact && (
                  <p className="text-xs text-gray-600">Contact: {resource.contact}</p>
                )}
                {resource.url && (
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                  >
                    Visit website
                  </a>
                )}
              </>
            )}

            {type === RESOURCE_CATEGORIES.PROFESSIONAL && (
              <>
                <h4 className="font-semibold text-blue-900">{resource.name}</h4>
                <p className="text-sm text-gray-700">{resource.title}</p>
                {resource.specialties && (
                  <p className="text-xs text-gray-600 mt-1">
                    Specializes in: {resource.specialties.join(', ')}
                  </p>
                )}
                {resource.location && (
                  <p className="text-xs text-gray-600">Location: {resource.location}</p>
                )}
                {resource.contact && (
                  <p className="text-xs text-gray-600">Contact: {resource.contact}</p>
                )}
                {resource.languages && (
                  <p className="text-xs text-gray-500">Languages: {resource.languages.join(', ')}</p>
                )}
                {resource.website && (
                  <a 
                    href={resource.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                  >
                    Visit website
                  </a>
                )}
              </>
            )}

            {type === RESOURCE_CATEGORIES.CRISIS && (
              <>
                <h4 className="font-semibold text-red-700">{resource.name}</h4>
                <p className="text-sm font-medium text-red-600 mt-1">
                  {resource.contact} <span className="text-gray-600">({resource.available})</span>
                </p>
                {resource.description && (
                  <p className="text-xs text-gray-700 mt-1">{resource.description}</p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceSuggestion; 