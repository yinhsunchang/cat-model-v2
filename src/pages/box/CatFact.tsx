import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

interface CatFact {
  fact: string;
  length: number;
}

type ErrorKey = "fetchError" | "unknownError";

const CAT_FACT_API = "https://catfact.ninja/fact";

function CatFact() {
  const { t } = useTranslation();

  const [data, setData] = useState("");
  const [error, setError] = useState<ErrorKey | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(CAT_FACT_API);
      if (!response.ok) throw new Error("Network response was not ok");
      const jsonData: CatFact = await response.json();
      setData(jsonData.fact);
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError("fetchError");
      } else {
        setError("unknownError");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 10000);

    return () => clearInterval(intervalId);
  }, [fetchData]);

  return (
    <div className="content padding-64">
      <h2 className="padding-16 text-light-grey">{t("fact.title")}</h2>
      <div
        className="display-container white"
        style={{ minHeight: "600px", display: "flex", alignItems: "center" }}
      >
        {error ? (
          <p className="large">{t(`fact.errors.${error}`)}</p>
        ) : (
          <p className="display-leftmiddle container xlarge leftbar margin">
            {loading && !data ? t("fact.loading") : data}
          </p>
        )}
      </div>
      <br />
      <button
        aria-label={t("fact.next")}
        className="button right light-grey center large block margin-bottom"
        onClick={fetchData}
      >
        {t("fact.next")} <i className="fa fa-chevron-circle-right"></i>
      </button>
    </div>
  );
}

export default CatFact;
