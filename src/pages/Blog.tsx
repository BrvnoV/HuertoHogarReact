import React from 'react';
import Blog from '../components/Blog';

export default function BlogPage() {
  return (
    <div className="container my-5">
      {/* El componente Blog sin límite mostrará
        todas las entradas del blog.
      */}
      <Blog title="Nuestro Blog" />
    </div>
  );
}