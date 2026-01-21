/**
 * Mock data for Atlas 3+3 prototype
 * 22 real-world sustainable architecture projects
 */

export interface MockProject {
  id: string;
  projectName: string;
  organizationName: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  region: string;
  status: string;
  fundingNeeded: number;
  fundingSpent: number;
  briefDescription: string;
  detailedDescription: string;
  successFactors: string;
  sdgs: number[];
  typologies: string[];
  requirements: string[];
  imageUrl?: string;
}

export const MOCK_PROJECTS: MockProject[] = [
  {
    id: "1",
    projectName: "Barcelona Superblocks: Urban Regeneration for Livable Streets",
    organizationName: "Barcelona City Council - Urban Ecology Agency",
    city: "Barcelona",
    country: "Spain",
    latitude: 41.3851,
    longitude: 2.1734,
    region: "SECTION_I",
    status: "IMPLEMENTED",
    fundingNeeded: 12500000,
    fundingSpent: 11200000,
    briefDescription: "Transforming city blocks into pedestrian-priority zones to reduce traffic, improve air quality, and create vibrant community spaces.",
    detailedDescription: "The Barcelona Superblocks (Superilles) initiative reclaims street space from cars and returns it to residents. Each superblock encompasses nine city blocks where through-traffic is restricted, speed limits are reduced to 10-20 km/h, and streets are redesigned as shared spaces with greenery, play areas, and community gathering spots.",
    successFactors: "Strong political leadership from Barcelona City Council; Co-design process with local residents; Phased implementation starting with low-cost tactical interventions; Integration with broader sustainable mobility strategy.",
    sdgs: [11, 13, 3],
    typologies: ["Public Realm & Urban Landscape", "Infrastructure"],
    requirements: ["Local Community Support", "Strong Political Leadership", "Public Sector Funding"],
  },
  {
    id: "2",
    projectName: "Medellín Urban Acupuncture: Library Parks in Informal Settlements",
    organizationName: "Municipality of Medellín - Urban Innovation Department",
    city: "Medellín",
    country: "Colombia",
    latitude: 6.2442,
    longitude: -75.5812,
    region: "SECTION_V",
    status: "IMPLEMENTED",
    fundingNeeded: 8750000,
    fundingSpent: 8200000,
    briefDescription: "Strategic placement of world-class library parks in marginalized neighborhoods to catalyze social transformation and urban renewal.",
    detailedDescription: "Medellín's Library Parks (Parques Biblioteca) represent urban acupuncture at its finest - placing exceptional public architecture and programming in the city's most challenged neighborhoods.",
    successFactors: "Political commitment to equity-focused urban investment; Architectural excellence creating neighborhood pride; Comprehensive programming beyond just books.",
    sdgs: [4, 10, 11, 16],
    typologies: ["Educational", "Public Realm & Urban Landscape", "Cultural"],
    requirements: ["Strong Political Leadership", "Public Sector Funding", "Community Engagement Framework"],
  },
  {
    id: "3",
    projectName: "Copenhagen District Heating: City-Wide Renewable Energy Distribution",
    organizationName: "Copenhagen District Heating (HOFOR)",
    city: "Copenhagen",
    country: "Denmark",
    latitude: 55.6761,
    longitude: 12.5683,
    region: "SECTION_I",
    status: "IMPLEMENTED",
    fundingNeeded: 2100000000,
    fundingSpent: 1950000000,
    briefDescription: "Comprehensive district heating network serving 98% of Copenhagen with renewable energy, eliminating individual heating systems and dramatically reducing carbon emissions.",
    detailedDescription: "Copenhagen operates one of the world's most comprehensive district heating systems, providing space heating and hot water to 98% of the city through an underground network of insulated pipes.",
    successFactors: "Long-term municipal ownership and planning; Gradual expansion and technology evolution; Strong regulatory framework requiring connection.",
    sdgs: [7, 11, 13],
    typologies: ["Infrastructure"],
    requirements: ["Strong Political Leadership", "Public Sector Funding", "Technical Expertise"],
  },
  {
    id: "4",
    projectName: "Singapore Vertical Farming: 30x30 Food Security Initiative",
    organizationName: "Singapore Food Agency & Sky Greens Pte Ltd",
    city: "Singapore",
    country: "Singapore",
    latitude: 1.3521,
    longitude: 103.8198,
    region: "SECTION_IV",
    status: "IN_PROGRESS",
    fundingNeeded: 45000000,
    fundingSpent: 38000000,
    briefDescription: "Pioneering vertical farming technologies to achieve 30% domestic food production by 2030 in land-scarce Singapore.",
    detailedDescription: "Singapore's 30x30 initiative aims to produce 30% of the nation's nutritional needs locally by 2030, despite having less than 1% of land available for agriculture.",
    successFactors: "Government-led strategic planning and financial support; Strong R&D partnerships with universities; Regulatory sandbox for food technology innovation.",
    sdgs: [2, 9, 11, 12],
    typologies: ["Industrial", "Infrastructure"],
    requirements: ["Strong Political Leadership", "Technical Expertise", "Research Institution Partnership"],
  },
  {
    id: "5",
    projectName: "Kigali Master Plan: Africa's Model Sustainable City",
    organizationName: "City of Kigali & Rwanda Development Board",
    city: "Kigali",
    country: "Rwanda",
    latitude: -1.9441,
    longitude: 30.0619,
    region: "SECTION_III",
    status: "IN_PROGRESS",
    fundingNeeded: 3200000000,
    fundingSpent: 1800000000,
    briefDescription: "Comprehensive urban master plan transforming Kigali into a green, inclusive, and resilient model city for Africa.",
    detailedDescription: "Kigali's 2040 Master Plan represents comprehensive urban transformation, building on Rwanda's remarkable post-genocide recovery.",
    successFactors: "Strong national political commitment and governance; Clear vision and long-term planning; Integration of environmental protection with development.",
    sdgs: [11, 13, 16, 10],
    typologies: ["Infrastructure", "Public Realm & Urban Landscape", "Residential"],
    requirements: ["Strong Political Leadership", "International Funding", "Community Engagement Framework"],
  },
  {
    id: "6",
    projectName: "Vienna Social Housing: 100 Years of Inclusive Urban Development",
    organizationName: "Wiener Wohnen (Vienna Housing Authority)",
    city: "Vienna",
    country: "Austria",
    latitude: 48.2082,
    longitude: 16.3738,
    region: "SECTION_I",
    status: "IMPLEMENTED",
    fundingNeeded: 850000000,
    fundingSpent: 820000000,
    briefDescription: "Century-long municipal housing program providing affordable, high-quality homes to 60% of Vienna's population.",
    detailedDescription: "Vienna's social housing program, dating to the 1920s, provides affordable rental housing to approximately 600,000 residents.",
    successFactors: "Century of consistent political commitment; Sustainable financing through dedicated housing tax; High architectural standards.",
    sdgs: [11, 10, 1],
    typologies: ["Residential"],
    requirements: ["Strong Political Leadership", "Public Sector Funding", "Favorable Policy Environment"],
  },
  {
    id: "7",
    projectName: "Curitiba Bus Rapid Transit: Pioneering Sustainable Urban Mobility",
    organizationName: "URBS (Urbanização de Curitiba)",
    city: "Curitiba",
    country: "Brazil",
    latitude: -25.4284,
    longitude: -49.2733,
    region: "SECTION_V",
    status: "IMPLEMENTED",
    fundingNeeded: 125000000,
    fundingSpent: 118000000,
    briefDescription: "World's first Bus Rapid Transit system, serving 85% of commuters and reducing car dependency.",
    detailedDescription: "Curitiba pioneered Bus Rapid Transit (BRT) in the 1970s, creating a metro-quality bus system that has become a global model.",
    successFactors: "Visionary planning leadership; Integration of transportation with urban development policy; Cost-effectiveness compared to rail alternatives.",
    sdgs: [11, 13, 9],
    typologies: ["Infrastructure"],
    requirements: ["Strong Political Leadership", "Public Sector Funding", "Technical Expertise"],
  },
  {
    id: "8",
    projectName: "Freiburg Solar City: Germany's Renewable Energy Showcase",
    organizationName: "City of Freiburg & Fraunhofer Institute",
    city: "Freiburg",
    country: "Germany",
    latitude: 47.9990,
    longitude: 7.8421,
    region: "SECTION_I",
    status: "IMPLEMENTED",
    fundingNeeded: 2800000000,
    fundingSpent: 2650000000,
    briefDescription: "Comprehensive renewable energy transformation making Freiburg Germany's solar capital and global sustainable city model.",
    detailedDescription: "Freiburg has transformed into the country's renewable energy capital, generating more solar power per capita than almost anywhere in the world.",
    successFactors: "Strong environmental movement and citizen engagement; Integration of university research with municipal policy; Early adoption of feed-in tariffs.",
    sdgs: [7, 11, 13],
    typologies: ["Infrastructure", "Residential"],
    requirements: ["Strong Political Leadership", "Technical Expertise", "Research Institution Partnership"],
  },
  {
    id: "9",
    projectName: "Portland Urban Growth Boundary: 50 Years of Smart Growth",
    organizationName: "Metro Portland Regional Government",
    city: "Portland",
    country: "United States",
    latitude: 45.5152,
    longitude: -122.6784,
    region: "SECTION_V",
    status: "IMPLEMENTED",
    fundingNeeded: 95000000,
    fundingSpent: 89000000,
    briefDescription: "Nation's first urban growth boundary containing sprawl, protecting farmland, and creating vibrant, walkable neighborhoods.",
    detailedDescription: "Portland's Urban Growth Boundary, established in 1973, contains urban development within a defined area, forcing denser development.",
    successFactors: "State-level planning mandate providing legal framework; Regional government structure enabling metropolitan coordination.",
    sdgs: [11, 15, 2],
    typologies: ["Infrastructure", "Public Realm & Urban Landscape"],
    requirements: ["Strong Political Leadership", "Favorable Policy Environment", "Community Engagement Framework"],
  },
  {
    id: "10",
    projectName: "Bogotá Ciclovía: Weekly Car-Free Streets for 2 Million People",
    organizationName: "Instituto Distrital de Recreación y Deporte (IDRD)",
    city: "Bogotá",
    country: "Colombia",
    latitude: 4.7110,
    longitude: -74.0721,
    region: "SECTION_V",
    status: "IMPLEMENTED",
    fundingNeeded: 12000000,
    fundingSpent: 11500000,
    briefDescription: "World's largest weekly car-free event, opening 121km of streets to 2 million cyclists, walkers, and families every Sunday.",
    detailedDescription: "Bogotá's Ciclovía transforms the city every Sunday and holiday, closing 121 kilometers of streets to cars.",
    successFactors: "Simple concept with massive participation; Strong safety protocols; Free participation ensuring inclusive access.",
    sdgs: [3, 11, 10],
    typologies: ["Public Realm & Urban Landscape", "Sports & Recreation"],
    requirements: ["Strong Political Leadership", "Community Engagement Framework", "Local Community Support"],
  },
  {
    id: "11",
    projectName: "Tokyo Disaster Preparedness: Resilient Megacity Planning",
    organizationName: "Tokyo Metropolitan Government - Bureau of Urban Development",
    city: "Tokyo",
    country: "Japan",
    latitude: 35.6762,
    longitude: 139.6503,
    region: "SECTION_IV",
    status: "IMPLEMENTED",
    fundingNeeded: 4500000000,
    fundingSpent: 4200000000,
    briefDescription: "Comprehensive urban resilience planning preparing 37 million people for earthquakes, floods, and climate change impacts.",
    detailedDescription: "Tokyo's comprehensive disaster preparedness system protects the world's largest urban agglomeration from earthquakes, tsunamis, and floods.",
    successFactors: "Historical experience with disasters driving political commitment; Integration of disaster planning with urban development.",
    sdgs: [11, 13, 1],
    typologies: ["Infrastructure", "Civic"],
    requirements: ["Strong Political Leadership", "Technical Expertise", "Community Engagement Framework"],
  },
  {
    id: "12",
    projectName: "Vancouver Olympic Village: Carbon-Neutral Neighborhood Development",
    organizationName: "City of Vancouver & Canada Mortgage and Housing Corporation",
    city: "Vancouver",
    country: "Canada",
    latitude: 49.2827,
    longitude: -123.1207,
    region: "SECTION_V",
    status: "IMPLEMENTED",
    fundingNeeded: 1200000000,
    fundingSpent: 1150000000,
    briefDescription: "First carbon-neutral neighborhood in North America, showcasing sustainable building design and urban planning innovations.",
    detailedDescription: "Vancouver's Olympic Village, built for the 2010 Winter Olympics, became North America's first carbon-neutral neighborhood.",
    successFactors: "Olympic momentum creating political will; Integration of social, environmental, and economic sustainability goals.",
    sdgs: [7, 11, 13],
    typologies: ["Residential", "Infrastructure"],
    requirements: ["Strong Political Leadership", "Public Sector Funding", "Private Sector Partnership"],
  },
  {
    id: "13",
    projectName: "Cape Town Day Zero: Water Crisis Management and Conservation",
    organizationName: "City of Cape Town Water and Sanitation Department",
    city: "Cape Town",
    country: "South Africa",
    latitude: -33.9249,
    longitude: 18.4241,
    region: "SECTION_III",
    status: "IMPLEMENTED",
    fundingNeeded: 375000000,
    fundingSpent: 340000000,
    briefDescription: "Emergency water conservation program that averted 'Day Zero' and transformed Cape Town into a water-resilient city.",
    detailedDescription: "Cape Town faced 'Day Zero' during the 2015-2018 drought, implementing aggressive demand management to avert crisis.",
    successFactors: "Crisis-driven political leadership and citizen mobilization; Transparent communication about severity and progress.",
    sdgs: [6, 11, 13],
    typologies: ["Infrastructure"],
    requirements: ["Strong Political Leadership", "Community Engagement Framework", "Technical Expertise"],
  },
  {
    id: "14",
    projectName: "Seoul Digital Media City: Technology Hub and Urban Regeneration",
    organizationName: "Seoul Digital Media City Development Corporation",
    city: "Seoul",
    country: "South Korea",
    latitude: 37.5665,
    longitude: 126.8956,
    region: "SECTION_IV",
    status: "IMPLEMENTED",
    fundingNeeded: 18000000000,
    fundingSpent: 16800000000,
    briefDescription: "Comprehensive redevelopment of industrial area into Asia's leading digital media and technology cluster.",
    detailedDescription: "Seoul Digital Media City transformed a 135-hectare industrial waste site into Northeast Asia's largest digital media cluster.",
    successFactors: "Strategic government planning and investment; Comprehensive infrastructure including fiber optic networks.",
    sdgs: [8, 9, 11],
    typologies: ["Commercial", "Infrastructure", "Industrial"],
    requirements: ["Strong Political Leadership", "Public Sector Funding", "Private Sector Partnership"],
  },
  {
    id: "15",
    projectName: "Curitiba Câmbio Verde - Green Exchange Waste-for-Food Program",
    organizationName: "Curitiba Municipal Environment Secretariat (SMMA)",
    city: "Curitiba",
    country: "Brazil",
    latitude: -25.4284,
    longitude: -49.2733,
    region: "SECTION_V",
    status: "IMPLEMENTED",
    fundingNeeded: 2500000,
    fundingSpent: 2500000,
    briefDescription: "City-wide initiative where residents trade recyclable materials for fresh produce - 4kg recyclables for 1kg fruits/vegetables.",
    detailedDescription: "Running since 1991, Curitiba's Green Exchange enables citizens to exchange recyclable materials for fresh fruits and vegetables.",
    successFactors: "Innovative solution addressing multiple challenges; Simple accessible model requiring no registration.",
    sdgs: [1, 2, 11, 12],
    typologies: ["Infrastructure", "Public Realm & Urban Landscape"],
    requirements: ["Local Community Support", "Strong Political Leadership", "Public Sector Funding"],
  },
  {
    id: "16",
    projectName: "Vauban District - Europe's Most Sustainable Urban Community",
    organizationName: "City of Freiburg - Vauban Development Office",
    city: "Freiburg",
    country: "Germany",
    latitude: 47.9990,
    longitude: 7.8421,
    region: "SECTION_I",
    status: "IMPLEMENTED",
    fundingNeeded: 158000000,
    fundingSpent: 158000000,
    briefDescription: "Car-reduced solar district with 5,500 residents in passive/plus-energy buildings, producing more renewable energy than consumed.",
    detailedDescription: "Vauban district transformed former military barracks into Europe's most sustainable urban community with plus-energy buildings.",
    successFactors: "Strong political commitment; German Energiewende policies making solar cost-competitive; Participatory planning.",
    sdgs: [7, 11, 13],
    typologies: ["Residential", "Infrastructure"],
    requirements: ["Strong Political Leadership", "Technical Expertise", "Community Engagement Framework"],
  },
  {
    id: "17",
    projectName: "Portland Green Streets - Sustainable Stormwater Management",
    organizationName: "City of Portland Bureau of Environmental Services",
    city: "Portland",
    country: "United States",
    latitude: 45.5152,
    longitude: -122.6784,
    region: "SECTION_V",
    status: "IMPLEMENTED",
    fundingNeeded: 86000000,
    fundingSpent: 86000000,
    briefDescription: "City-wide green infrastructure network of 2,500+ facilities using rain gardens, bioswales, saving $58M over conventional drainage.",
    detailedDescription: "Portland transformed stormwater management from conventional underground pipes to above-ground sustainable strategies.",
    successFactors: "Financial analysis demonstrating $58M cost savings; Multiple co-benefits beyond drainage; Binding City Policy.",
    sdgs: [6, 11, 13, 15],
    typologies: ["Infrastructure", "Public Realm & Urban Landscape"],
    requirements: ["Strong Political Leadership", "Public Sector Funding", "Favorable Policy Environment"],
  },
  {
    id: "18",
    projectName: "Malmö Western Harbour Bo01 - Climate-Neutral Urban District",
    organizationName: "City of Malmö - Western Harbour Development",
    city: "Malmö",
    country: "Sweden",
    latitude: 55.6167,
    longitude: 12.9833,
    region: "SECTION_I",
    status: "IMPLEMENTED",
    fundingNeeded: 450000000,
    fundingSpent: 450000000,
    briefDescription: "187-hectare transformation of shipyard into vibrant sustainable district with 10,000 residents, 100% locally renewable energy.",
    detailedDescription: "Malmö Western Harbour transformed a run-down shipyard into a vibrant 'city within a city' with 100% renewable energy.",
    successFactors: "Transforming brownfield into sustainable asset; Strong municipal vision; 100% locally renewable energy demonstrating feasibility.",
    sdgs: [7, 11, 12, 13],
    typologies: ["Residential", "Infrastructure"],
    requirements: ["Strong Political Leadership", "Public Sector Funding", "Technical Expertise"],
  },
  {
    id: "19",
    projectName: "Addis Ababa Light Rail Transit - Sub-Saharan Africa First LRT",
    organizationName: "Ethiopian Railways Corporation",
    city: "Addis Ababa",
    country: "Ethiopia",
    latitude: 9.0320,
    longitude: 38.7469,
    region: "SECTION_III",
    status: "IMPLEMENTED",
    fundingNeeded: 475000000,
    fundingSpent: 475000000,
    briefDescription: "Sub-Saharan Africa's first light rail: 31.6km system carrying 60,000 passengers/hour powered by renewable energy.",
    detailedDescription: "Inaugurated in 2015 as Sub-Saharan Africa's first modern light-rail train, powered by Ethiopia's renewable energy grid.",
    successFactors: "Sub-Saharan Africa first demonstrating leadership; Renewable energy grid making it truly low-carbon; Measurable emissions reductions.",
    sdgs: [7, 9, 11, 13],
    typologies: ["Infrastructure"],
    requirements: ["Strong Political Leadership", "Technical Expertise", "International Funding"],
  },
  {
    id: "20",
    projectName: "Masdar City - Zero-Carbon Eco-City in the Desert",
    organizationName: "Masdar / Mubadala Development Company",
    city: "Abu Dhabi",
    country: "United Arab Emirates",
    latitude: 24.4292,
    longitude: 54.6167,
    region: "SECTION_III",
    status: "IN_PROGRESS",
    fundingNeeded: 19800000000,
    fundingSpent: 2400000000,
    briefDescription: "6 sq km sustainable city in Abu Dhabi desert targeting 50,000 residents with net-zero energy buildings, renewable power.",
    detailedDescription: "Masdar City is Abu Dhabi's ecology project designed by Foster and Partners, featuring net-zero energy buildings.",
    successFactors: "Strong government political and financial commitment; World-class design; Economic free zone attracting investment.",
    sdgs: [7, 9, 11, 12, 13],
    typologies: ["Commercial", "Infrastructure", "Industrial"],
    requirements: ["Strong Political Leadership", "Public Sector Funding", "Private Sector Partnership"],
  },
  {
    id: "21",
    projectName: "Mexico City Cosecha de Lluvia - Rainwater Harvesting for Water Security",
    organizationName: "SEDEMA - Mexico City Environment Secretariat",
    city: "Mexico City",
    country: "Mexico",
    latitude: 19.4326,
    longitude: -99.1332,
    region: "SECTION_V",
    status: "IN_PROGRESS",
    fundingNeeded: 18000000,
    fundingSpent: 18000000,
    briefDescription: "Citywide rainwater harvesting: 2,300+ systems in 1,800+ schools serving 1.3M users, capturing 918 million liters annually.",
    detailedDescription: "Mexico City's program addresses water scarcity in marginalized neighborhoods, with systems installed in educational facilities city-wide.",
    successFactors: "Addressing critical need; Low-cost appropriate technology; Schools-first strategy maximizing impact; Cultural relevance.",
    sdgs: [6, 11, 13],
    typologies: ["Infrastructure", "Educational"],
    requirements: ["Community Engagement Framework", "Local Community Support", "Technical Expertise"],
  },
  {
    id: "22",
    projectName: "Cape Town New Water Programme - Overcoming Day Zero Crisis",
    organizationName: "City of Cape Town Water & Sanitation Department",
    city: "Cape Town",
    country: "South Africa",
    latitude: -33.9249,
    longitude: 18.4241,
    region: "SECTION_III",
    status: "IN_PROGRESS",
    fundingNeeded: 580000000,
    fundingSpent: 250000000,
    briefDescription: "Comprehensive water resilience strategy delivering 300 million liters/day from alternative sources by 2030.",
    detailedDescription: "Following the 2015-2018 drought, Cape Town adopted a comprehensive resilience strategy with diversified water sources.",
    successFactors: "Crisis focusing political will; Diversified portfolio approach reducing risk; Green Bond financing; Nature-based solutions.",
    sdgs: [6, 11, 13],
    typologies: ["Infrastructure"],
    requirements: ["Strong Political Leadership", "Community Engagement Framework", "Technical Expertise"],
  },
];

// Helper functions for mock data
export function calculateMockKPIs() {
  const total = MOCK_PROJECTS.length;
  const uniqueCities = new Set(MOCK_PROJECTS.map(p => p.city)).size;
  const uniqueCountries = new Set(MOCK_PROJECTS.map(p => p.country)).size;
  const totalFunding = MOCK_PROJECTS.reduce((sum, p) => sum + p.fundingNeeded, 0);
  const totalSpent = MOCK_PROJECTS.reduce((sum, p) => sum + p.fundingSpent, 0);

  return {
    totalProjects: total,
    citiesEngaged: uniqueCities,
    countriesRepresented: uniqueCountries,
    totalFundingNeeded: totalFunding,
    totalFundingSpent: totalSpent,
    approvedProjects: total,
  };
}

export function getMockSDGDistribution() {
  const sdgCounts: Record<number, number> = {};

  MOCK_PROJECTS.forEach(project => {
    project.sdgs.forEach(sdg => {
      sdgCounts[sdg] = (sdgCounts[sdg] || 0) + 1;
    });
  });

  return Object.entries(sdgCounts).map(([sdg, count]) => ({
    sdg: parseInt(sdg),
    count,
  }));
}

export function getMockRegionalFunding() {
  const regionFunding: Record<string, { needed: number; spent: number }> = {};

  MOCK_PROJECTS.forEach(project => {
    if (!regionFunding[project.region]) {
      regionFunding[project.region] = { needed: 0, spent: 0 };
    }
    regionFunding[project.region].needed += project.fundingNeeded;
    regionFunding[project.region].spent += project.fundingSpent;
  });

  return Object.entries(regionFunding).map(([region, funding]) => ({
    region,
    fundingNeeded: funding.needed,
    fundingSpent: funding.spent,
  }));
}

export function getMockTypologyDistribution() {
  const typologyCounts: Record<string, number> = {};

  MOCK_PROJECTS.forEach(project => {
    project.typologies.forEach(typology => {
      typologyCounts[typology] = (typologyCounts[typology] || 0) + 1;
    });
  });

  return Object.entries(typologyCounts)
    .map(([typology, count]) => ({ typology, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}
