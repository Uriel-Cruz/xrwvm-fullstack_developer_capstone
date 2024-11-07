import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState(null);  // Inicializado en null
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [postReview, setPostReview] = useState(<></>);

  let curr_url = window.location.href;
  let root_url = curr_url.substring(0, curr_url.indexOf("dealer"));
  let params = useParams();
  let id = params.id;
  let dealer_url = root_url + `djangoapp/dealer/${id}`;
  let reviews_url = root_url + `djangoapp/reviews/dealer/${id}`;
  let post_review = root_url + `postreview/${id}`;

  // Obtener el dealer
  const get_dealer = async () => {
    setIsLoading(true);  // Inicia la carga
    try {
      const res = await fetch(dealer_url, { method: "GET" });
      const retobj = await res.json();

      console.log("Respuesta de la API para el dealer:", retobj);

      if (retobj.status === 200 && retobj.dealer) {
        setDealer(retobj.dealer);  // Asignar directamente si es un objeto
      } else {
        console.error("No se encontraron datos del dealer", retobj);
      }
    } catch (error) {
      console.error("Error al obtener los datos del dealer:", error);
    } finally {
      setIsLoading(false);  // Termina la carga
    }
  };

  // Obtener reseñas
  const get_reviews = async () => {
    // Imprimir la URL para verificar que está bien formada
    console.log("URL de reseñas:", reviews_url);
    
    try {
      const res = await fetch(reviews_url, { method: "GET" });
      const text = await res.text(); // Obtener la respuesta como texto
      console.log("Contenido de la respuesta de reseñas:", text); // Imprimir el texto de la respuesta
  
      // Intentar parsear la respuesta si es JSON
      try {
        const retobj = JSON.parse(text);
        if (retobj.status === 200) {
          if (retobj.reviews.length > 0) {
            setReviews(retobj.reviews);
          } else {
            setUnreviewed(true);
          }
        }
      } catch (jsonError) {
        console.error("La respuesta no es JSON válida:", jsonError);
      }
    } catch (error) {
      console.error("Error al obtener reseñas:", error);
    }
  };
  

  const senti_icon = (sentiment) => {
    let icon = sentiment === "positive" ? positive_icon : sentiment === "negative" ? negative_icon : neutral_icon;
    return icon;
  };

  useEffect(() => {
    get_dealer();
    get_reviews();
    if (sessionStorage.getItem("username")) {
      setPostReview(<a href={post_review}><img src={review_icon} style={{ width: '10%', marginLeft: '10px', marginTop: '10px' }} alt='Post Review' /></a>);
    }
  }, [id]);  // Ejecuta cuando cambia el id del dealer

  // Verificar si los datos del dealer están cargados y si la página está cargando
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey" }}>
          {dealer ? dealer.full_name : "Loading..."}
        </h1>
        <h4 style={{ color: "grey" }}>
          {dealer ? `${dealer.city}, ${dealer.address}, Zip - ${dealer.zip}, ${dealer.state}` : "Loading address..."}
        </h4>
      </div>
      <div className="reviews_panel">
        {reviews.length === 0 && !unreviewed ? (
          <text>Loading Reviews....</text>
        ) : unreviewed ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className='review_panel'>
              <img src={senti_icon(review.sentiment)} className="emotion_icon" alt='Sentiment' />
              <div className='review'>{review.review}</div>
              <div className="reviewer">{review.name} {review.car_make} {review.car_model} {review.car_year}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;
