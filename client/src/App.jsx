import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./Pages/Home";
import Authentication from "./Authentication/Authentication";
import JobPage from "./Pages/JobPage";
import PostJob from "./Pages/PostJob";
import JobDetails from "./Pages/JobDetails";
import MyApplications from "./Pages/MyApplications";
import MyJobs from "./Pages/MyJobs";
import SavedJobs from "./Pages/SavedJobs";
import RecruiterRoute from "./protectedRoute/RecruiterRoute";
import PageNotFound from "./Pages/PageNotFound";
import CandidateRoute from "./protectedRoute/CandidateRoute";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/auth",
      element: <Authentication />,
    },
    {
      path: "/*",
      element: <PageNotFound />,
    },
    {
      path: "/candidate",
      element: <CandidateRoute />,
      children: [
        {
          path: "jobs",
          element: <JobPage />,
        },
        {
          path: "job-details/:jid",
          element: <JobDetails />,
        },
        {
          path: "my-applications",
          element: <MyApplications />,
        },
        {
          path: "saved-jobs",
          element: <SavedJobs />,
        },
      ],
    },
    {
      path: "/recruiter",
      element: <RecruiterRoute />,
      children: [
        {
          path: "jobs",
          element: <JobPage />,
        },
        {
          path: "post-job",
          element: <PostJob />,
        },
        {
          path: "job-details/:jid",
          element: <JobDetails />,
        },
        {
          path: "my-jobs",
          element: <MyJobs />,
        },
      ],
    },
  ]);
  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;