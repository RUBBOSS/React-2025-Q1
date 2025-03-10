
export async function fetchHomeData() {
  try {
    // Use relative URL for both client and server environments
    const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/pokemon?limit=12`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch home data');
    }
    
    const data = await response.json();
    
    // Process the data to match the HomeData structure
    const pokemonData = await Promise.all(
      data.results.map(async (pokemon: { name: string; url: string }) => {
        const pokemonId = pokemon.url.split('/').filter(Boolean).pop();
        const detailResponse = await fetch(`${baseUrl}/api/pokemon/${pokemonId}`);
        
        if (!detailResponse.ok) {
          throw new Error(`Failed to fetch details for ${pokemon.name}`);
        }
        
        return await detailResponse.json();
      })
    );
    
    return {
      pokemonData,
      totalCount: data.count
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    throw error;
  }
}

export async function fetchAboutData() {
  try {
    const baseUrl = typeof window !== 'undefined' ? '' : 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/about`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch about data');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching about data:', error);
    throw error;
  }
}
