import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Balances from "./Balance";
import './App.css'



const router = createBrowserRouter([
  {
    path: "/",
    element: <Balances />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;