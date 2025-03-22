export default function CustomerTrainingPlan() {
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  return <></>;
}