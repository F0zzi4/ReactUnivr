export default function HomePage() {
  const dataUser = sessionStorage.getItem("user");
  const user = dataUser ? JSON.parse(dataUser) : null;

  return (
    <div className="text-center">
      <b>Benvenuto {user.Name} {user.Surname}!</b>
    </div>
  );
}
