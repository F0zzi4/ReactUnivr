export default function HomePage() {
  const sessionData = sessionStorage.getItem('sessionData');
  const parsedSessionData = sessionData ? JSON.parse(sessionData) : null;

  return (
    <div>
      {parsedSessionData}
    </div>
  );
}