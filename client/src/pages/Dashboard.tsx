import { useContext } from "react";
import { UserContext } from "../../context/userContext";

import DashboardComponent from "../components/DashboardComponent";

export default function Dashboard(){
    const userContext = useContext(UserContext)

    if (!userContext) {
        return <div>Loading...</div>;
      }

      const { user } = userContext;
    return(
        <div>
 
 <DashboardComponent />
            <h1>Dashboard</h1>
            {!!user&&(<h2>hello noob {user.name}</h2>)}
            {!!user&&(<h2>{user.role}</h2>)}
        </div>

        
    )
}