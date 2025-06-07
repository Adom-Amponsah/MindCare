const Resources = () => {
  const supportGroups = [
    {
      id: 1,
      name: "Anxiety Support Circle",
      description: "A safe space to share experiences and coping strategies for anxiety.",
      schedule: "Every Tuesday, 6 PM",
      platform: "Zoom",
    },
    {
      id: 2,
      name: "Depression Support Group",
      description: "Connect with others who understand what you're going through.",
      schedule: "Every Thursday, 7 PM",
      platform: "WhatsApp",
    },
    {
      id: 3,
      name: "Stress Management Workshop",
      description: "Learn practical techniques to manage daily stress.",
      schedule: "Every Saturday, 10 AM",
      platform: "Google Meet",
    },
  ]

  const professionals = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialization: "Clinical Psychologist",
      experience: "15 years",
      languages: ["English", "Pidgin"],
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialization: "Psychiatrist",
      experience: "12 years",
      languages: ["English", "Twi"],
    },
    {
      id: 3,
      name: "Dr. Ama Mensah",
      specialization: "Counseling Psychologist",
      experience: "10 years",
      languages: ["English", "Pidgin", "Ga"],
    },
  ]

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Support Groups Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Support Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportGroups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{group.name}</h3>
                  <p className="text-gray-600 mb-4">{group.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {group.schedule}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {group.platform}
                  </div>
                </div>
                <div className="bg-indigo-50 px-6 py-4">
                  <button className="w-full bg-indigo-600 text-white rounded-full py-2 hover:bg-indigo-700 transition-colors">
                    Join Group
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Professionals Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Professional Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((professional) => (
              <div
                key={professional.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{professional.name}</h3>
                  <p className="text-indigo-600 font-medium mb-2">{professional.specialization}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {professional.experience} experience
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {professional.languages.map((language, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-indigo-50 px-6 py-4">
                  <button className="w-full bg-indigo-600 text-white rounded-full py-2 hover:bg-indigo-700 transition-colors">
                    Book Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Section */}
        <div className="mt-16 bg-red-50 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Need Immediate Help?</h3>
              <p className="mt-2 text-red-700">
                If you're experiencing a mental health emergency, please call our 24/7 crisis hotline:
                <span className="font-bold block mt-1">+233 123 456 789</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Resources 