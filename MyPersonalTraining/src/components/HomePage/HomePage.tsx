export default function HomePage() {
  const dataUser = sessionStorage.getItem("user");
  const user = dataUser ? JSON.parse(dataUser) : null;

  return (
    <div>
      Benvenuto {user.Name} {user.Surname}!
    </div>
  );
}
