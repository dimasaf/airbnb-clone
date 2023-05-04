"use client";

type HeadingProps = {
  center?: boolean;
  title: string;
  subtitle?: string;
};

const Heading = ({ center, title, subtitle }: HeadingProps) => {
  return (
    <div className={center ? "text-center" : "text-start"}>
      <div className="text-2xl font-bold">{title}</div>
      <div className="font-light text-neutral-500 mt-2">{subtitle}</div>
    </div>
  );
};

export default Heading;
