import { useLoaderData, useNavigation } from 'react-router-dom';

interface HomeData {
  message: string;
}

export default function Home() {
  const { message } = useLoaderData() as HomeData;
  const navigation = useNavigation();
  
  if (navigation.state === "loading") {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h1>{message}</h1>
      {/* ...existing code... */}
    </div>
  );
}
