
// pages/products.js
import Link from 'next/link'; // Optional, for linking to a detail page

export default function ProductsPage({ products }) {
  return (
    <div>
      <h1>Our Products</h1>
      <div className="products-grid">
        {products.map((product) => {
          // 1. Get the image URL. Use optional chaining to avoid errors if image is missing.
          const imageAttr = product.attributes.IMAGE_UPLOAD?.data?.attributes;
          const imageUrl = imageAttr ? `http://localhost:1337${imageAttr.url}` : null;

          // 2. Get the product price and name
          const price = product.attributes.PROL; // Using 'PROL' as shown in your screenshot
          const name = product.attributes.name; // Assuming you have a 'name' field

          return (
            <div key={product.id} className="product-card">
              {/* 3. Display the product image */}
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={name} 
                  width={300} 
                  height={200}
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div>No Image</div> // Placeholder if no image is set
              )}
              {/* 4. Display product info */}
              <h3>{name}</h3>
              <p>Price: ₦{price?.toLocaleString()}</p> 
              {/* Optional: Add a link to view more details */}
              {/* <Link href={`/products/${product.id}`}>View Product</Link> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// This function runs on the server side to fetch data
export async function getStaticProps() {
  try {
    // Fetch data from Strapi API
    // The magic is 'populate=IMAGE_UPLOAD'. This tells Strapi to include the image data.
    const res = await fetch('http://localhost:1337/api/products?populate=IMAGE_UPLOAD');
    const productsData = await res.json();

    // Return the data as props to the page component
    return {
      props: { 
        products: productsData.data 
      },
    };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return {
      props: { 
        products: [] 
      },
    };
  }
}