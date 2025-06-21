const MyIcon = ({ width = 24, height = 24, className = "" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="black"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
  >
    <path d="M8 20h24a6 6 0 1 0 -6 -6" />
    <path d="M8 32h40a6 6 0 1 0 -6 -6" />
    <path d="M8 44h24a6 6 0 1 1 -6 6" />
  </svg>
);

export default MyIcon;
