import React from 'react';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse bg-primary-100 dark:bg-primary-800 rounded-md ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
