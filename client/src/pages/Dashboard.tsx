import { useContext } from "react";
import { UserContext } from "../../context/userContext";

import DashboardComponent from "../components/DashboardComponent";

export default function Dashboard(){
    const userContext = useContext(UserContext)

    if (!userContext) {
        return <div>Loading...</div>;
      }
    return(
        
 
 <DashboardComponent />
           

        
    )
}