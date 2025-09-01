import React              from "react";
import { Routes, Route }  from "react-router-dom";

import ScrollToTop        from "./components/ScrollToTop";
import Login              from "./pages/Login";
import Register           from "./pages/Register";
import Logout             from "./pages/Logout";

/* ===== TEST FIRESTORE ===== */
import TestFirestore from "./pages/TestFirestore";

/* ===== STUDENTE ===== */
import StudentApp         from "./student/StudentApp";
import StudentCourses     from "./components/StudentCourses";
import MyCourses          from "./student/MyCourses";
import CourseDetail       from "./student/CourseDetail";
import LessonPage         from "./student/LessonPage";
import ExploreCourses     from "./student/ExploreCourses";
import StudentProfile     from "./student/StudentProfile";
import StudentProfileEdit from "./student/StudentProfileEdit";
import StudentFAQ         from "./student/StudentFAQ";

/* ===== DOCENTE ===== */
import TeacherApp             from "./teacher/TeacherApp";
import TeacherCourses         from "./teacher/TeacherCourses";
import TeacherCourseDetail    from "./teacher/TeacherCourseDetail";
import TeacherSectionNew      from "./teacher/TeacherSectionNew";
import TeacherLessonEdit      from "./teacher/TeacherLessonEdit";
import TeacherLessonNew       from "./teacher/TeacherLessonNew";
import TeacherLessonPreview   from "./teacher/TeacherLessonPreview";
import TeacherCourseNew       from "./teacher/TeacherCourseNew";
import TeacherCourseEdit      from "./teacher/TeacherCourseEdit";
import TeacherDashboard       from "./teacher/TeacherGeneralDashboard";
import TeacherCourseDashboard from "./teacher/TeacherCourseDashboard";
import TeacherProfile         from "./teacher/TeacherProfile";
import TeacherProfileEdit     from "./teacher/TeacherProfileEdit";
import TeacherAssessments     from "./teacher/TeacherAssessments";

/* ===== AUTH STATE & GUARDIE ===== */
import AuthProvider   from "./context/AuthContext";
import RequireAuth    from "./routes/RequireAuth";
import RequireRole    from "./routes/RequireRole";
import RoleRedirector from "./components/RoleRedirector";

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />

      <Routes>
        {/* ===== ACCESSO/REGISTRAZIONE ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />

        {/* Home → redirect automatico in base al ruolo */}
        <Route path="/" element={<RoleRedirector />} />

        {/* Area privata (richiede login) */}
        <Route element={<RequireAuth />}>
          {/* (Opzionale) pagina di test solo se loggato */}
          <Route path="/test" element={<TestFirestore />} />

          {/* ===== LATO STUDENTE (ruolo: "student") ===== */}
          <Route element={<RequireRole role="student" />}>
            <Route path="/studente" element={<StudentApp />}>
              <Route index element={<StudentCourses />} />
              <Route path="corsi" element={<MyCourses />} />
              <Route path="scopri" element={<ExploreCourses />} />
              <Route path="profilo" element={<StudentProfile />} />
              <Route path="impostazioni" element={<StudentProfileEdit />} />
              <Route path="faq" element={<StudentFAQ />} />
              <Route path="corsi/:id" element={<CourseDetail />} />
              <Route
                path="corsi/:id/sezioni/:secId/lezioni/:lezId"
                element={<LessonPage />}
              />
            </Route>
          </Route>

          {/* ===== LATO DOCENTE (ruolo: "teacher") ===== */}
          <Route element={<RequireRole role="teacher" />}>
            <Route path="/docente" element={<TeacherApp />}>
              <Route path="corsi" element={<TeacherCourses />} />
              <Route path="corsi/:courseId" element={<TeacherCourseDetail />} />
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route
                path="corsi/:courseId/dashboard"
                element={<TeacherCourseDashboard />}
              />
              <Route path="profilo" element={<TeacherProfile />} />
              <Route path="profilo/modifica" element={<TeacherProfileEdit />} />
              <Route path="valutazioni" element={<TeacherAssessments />} />
              {/* Lezioni */}
              <Route
                path="corsi/:courseId/sezioni/:secId/lezioni/nuova"
                element={<TeacherLessonNew />}
              />
              <Route
                path="corsi/:courseId/sezioni/:secId/lezioni/:lezId"
                element={<TeacherLessonPreview />}
              />
              <Route
                path="corsi/:courseId/sezioni/nuova"
                element={<TeacherSectionNew />}
              />
              <Route
                path="corsi/:courseId/sezioni/:secId/lezioni/:lezId/modifica"
                element={<TeacherLessonEdit />}
              />
              <Route path="corsi/nuovo" element={<TeacherCourseNew />} />
              <Route path="corsi/:courseId/modifica" element={<TeacherCourseEdit />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback → lascia decidere al RoleRedirector */}
        <Route path="*" element={<RoleRedirector />} />
      </Routes>
    </AuthProvider>
  );
}
