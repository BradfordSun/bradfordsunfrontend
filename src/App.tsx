import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage, NotFoundError, ForeignAffairs, TestPage } from "./pages";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/foreignaffairs" element={<ForeignAffairs />} />
          <Route path="/testpage" element={<TestPage />} />
          <Route path="*" element={<NotFoundError />} />
        </Routes>
      </BrowserRouter>
  </div>
  )
}