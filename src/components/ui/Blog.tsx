import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Simulación de los datos de tu blog
const blogPosts = [
  {
    id: 1,
    title: 'Beneficios de las Frutas Orgánicas',
    excerpt: 'Descubre cómo las frutas orgánicas pueden mejorar tu salud.',
    image: '/assets/img/frutasalud.jpg',
    slug: '/blog/beneficios-frutas-organicas' // Ruta de ejemplo
  },
  {
    id: 2,
    title: 'Recetas Saludables con Verduras',
    excerpt: 'Inspírate con nuestras recetas para una dieta equilibrada.',
    image: '/assets/img/rece.jpg',
    slug: '/blog/recetas-saludables-verduras' // Ruta de ejemplo
  }
  // Aquí podrías añadir más posts si quisieras
];

// Recibimos las props "title" y "limit" que definimos en las páginas
interface BlogProps {
  title: string;
  limit?: number; // Límite opcional de posts a mostrar
}

export default function Blog({ title, limit }: BlogProps) {
  
  // Aplicamos el límite si la prop "limit" fue enviada
  const postsToShow = limit ? blogPosts.slice(0, limit) : blogPosts;

  return (
    <section id="blog" className="container my-5">
      <h2 className="text-center mb-4" style={{ color: 'white' }}>{title}</h2>
      <div className="row">
        {postsToShow.map(post => (
          <div key={post.id} className="col-md-6 mb-4 d-flex">
            <Card className="h-100">
              <Card.Img 
                variant="top" 
                src={post.image} 
                className="blog-card-img" // Clase de tu style.css para altura/object-fit
              />
              <Card.Body className="d-flex flex-column text-dark">
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>
                  {post.excerpt}
                </Card.Text>

                {/* --- INICIO DE LA CORRECCIÓN --- */}
                
                {/* El <Link> ahora envuelve al botón.
                  Ponemos 'mt-auto' en el Link para que sea el elemento que se "empuja" al fondo.
                  Añadimos 'text-decoration-none' para que no parezca un link subrayado.
                */}
                <Link 
                  to={post.slug} 
                  className="mt-auto text-decoration-none"
                >
                  {/* El botón ahora solo se preocupa de su apariencia
                    y ocupa el 100% del ancho del Link.
                  */}
                  <Button 
                    variant="primary"
                    className="w-100" 
                  >
                    Leer más
                  </Button>
                </Link>

                {/* --- FIN DE LA CORRECCIÓN --- */}

              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}