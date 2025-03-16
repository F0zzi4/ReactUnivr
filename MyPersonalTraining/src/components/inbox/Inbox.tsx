export default function Inbox() {
    const userData = sessionStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
  
    return <></>;
  }