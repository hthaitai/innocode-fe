import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Unauthorized = () => {
  const { t } = useTranslation("pages");
  
  return (
     <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">{t("unauthorized.title")}</h1>
      <p className="text-gray-600 mb-8">{t("unauthorized.message")}</p>
      <Link to="/" className="text-blue-500 hover:underline">
        {t("unauthorized.backToHome")}
      </Link>
    </div>
  );
};

export default Unauthorized;
