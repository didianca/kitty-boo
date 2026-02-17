const BASE_URL = import.meta.env.BASE_URL;

type SpiderwebImageProps = {
  getWidth: () => number;
};

export function SpiderwebImage({ getWidth }: SpiderwebImageProps) {
  return (
    <img
      id="spiderweb-image"
      className="spiderweb-image"
      src={`${BASE_URL}spiderweb.png`}
      alt=""
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: `${getWidth()}px`,
        height: "auto",
        opacity: 1,
        pointerEvents: "none",
        zIndex: 1,
        transition: "width 0.2s",
      }}
    />
  );
}