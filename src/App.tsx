import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  HomePage,
  NotFoundError,
  ForeignAffairs,
  LLMChatbot,
  ServerError,
  TestPage,
} from "./pages";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/foreignaffairs" element={<ForeignAffairs />} />
          <Route path="/llmchatbot" element={<LLMChatbot />} />
          <Route path="/testpage" element={<TestPage />} />
          <Route path="/error" element={<ServerError />} />
          <Route path="*" element={<NotFoundError />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
