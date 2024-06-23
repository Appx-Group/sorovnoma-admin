import { useState, useEffect } from "react";

const SvgComponent = ({ url }: { url: string }) => {
  const [svgContent, setSvgContent] = useState("");

  const [isSvg, setIsSvg] = useState(false);

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await fetch(url);

        const contentType = response.headers.get("content-type");

        if (contentType === "text/plain") {
          const svgText = await response.text();
          setSvgContent(encodeURIComponent(svgText));
          setIsSvg(true);
        }
      } catch (error) {
        console.error("Error fetching SVG:", error);
      }
    };

    fetchSvg();
  }, [url]);

  if (!isSvg) {
    return <img src={url} alt="Image" className="h-7" />;
  } else {
    return <img src={`data:image/svg+xml,${svgContent}`} alt="SVG" />;
  }
};

export default SvgComponent;
