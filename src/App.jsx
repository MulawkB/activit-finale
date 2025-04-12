import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import "./App.css";
import { addReviews } from "./redux/reviewsSlice";
import { selectReviews } from "./redux/selectors";
import { deleteReview } from "./redux/reviewsSlice";

function App() {
  // API
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redux / IMMER
  const dispatch = useDispatch();
  const reviews = useSelector(selectReviews);

  // Formulaire
  const schema = yup.object().shape({
    comment: yup
      .string()
      .required("Le commentaire est obligatoire")
      .max(500, "Le commentaire excéde la limite de 500 caractères"),
    note: yup
      .string()
      .required("La note est obligatoire")
      .oneOf(["1", "2", "3", "4", "5"], "Veuiller selectioner une note "),
    acceptConditions: yup
      .boolean()
      .oneOf([true], "Vous devez accepter les conditions générales"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      comment: "",
      note: "",
      acceptConditions: false,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    dispatch(
      addReviews({
        text: data.comment,
        note: data.note,
      })
    );
    reset();
  };

  // API
  useEffect(() => {
    async function fetchMovie() {
      try {
        const response = await fetch("https://jsonfakery.com/movies/random/");
        if (!response.ok) {
          throw new Error(
            `Erreur HTTP: ${
              response.statusText ? response.statusText + " - " : ""
            }${response.status}`
          );
        }
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, []);
  if (error) return <p>Erreur : {error}</p>;
  if (loading) return <p>Chargement...</p>;

  return (
    movie && (
      <>
        <Container className="my-5">
          <Row className="justify-content-center">
            <Col md={6} key={movie.movie_id}>
              <Card>
                <Card.Img
                  src={movie.poster_path}
                  alt={movie.original_title}
                ></Card.Img>
                <Card.Body>
                  <Card.Title>
                    <strong>{movie.original_title} </strong>
                  </Card.Title>
                  <Card.Text>
                    Sortie :{" "}
                    {new Date(movie.release_date).toLocaleDateString("fr-FR")}
                  </Card.Text>
                  <Card.Text>{movie.overview}</Card.Text>
                  <Card.Text>
                    Note moyenne : {movie.vote_average} ({movie.vote_count}{" "}
                    votes)
                  </Card.Text>
                </Card.Body>
              </Card>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Label className="mt-4">
                  <h2>Commentaires</h2>
                </Form.Label>
                <Form.Group controlId="Comment">
                  <Form.Label>Ajouter un commentaire</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    {...register("comment")}
                    isInvalid={!!errors.comment}
                  />
                  <p className="error-message">{errors.comment?.message}</p>
                </Form.Group>
                <Form.Group className="mt-3" controlId="Note">
                  <Form.Label>Note</Form.Label>
                  <Form.Select {...register("note")} 
                  isInvalid={!!errors.note}>
                    <option value="">Sélectionnez une note</option>
                    {Array.from({ length: 5 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </Form.Select>
                  <p className="error-message">{errors.note?.message} </p>
                </Form.Group>
                <Form.Group className="mt-3" controlId="AcceptConditions">
                  <Form.Check
                    isInvalid={!!errors.comment}
                    type="checkbox"
                    label="J'accepte les conditions générales"
                    {...register("acceptConditions")}
                  />
                  <p className="error-message">
                    {errors.acceptConditions?.message}
                  </p>
                </Form.Group>
                <Button className="mt-3" type="submit">
                  Ajouter
                </Button>
              </Form>
              {reviews.length === 0 && (
                <Alert className="bg-info text-primary bg-opacity-25 rounded-sm mt-3 ">
                  Aucun commentaire pour le moment.
                </Alert>
              )}
              {reviews.map((review) => (
                <Card className="mb-3 mt-4">
                  <Row>
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <Col className="ms-3">
                        <Card.Text>
                          <strong>Note : {review.note}/5</strong>
                          <br></br>
                          {review.text}
                        </Card.Text>
                      </Col>
                      <Col className="d-flex justify-content-end me-3">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => dispatch(deleteReview(review.id))}
                        >
                          Supprimer
                        </Button>
                      </Col>
                    </Card.Body>
                  </Row>
                </Card>
              ))}
            </Col>
          </Row>
        </Container>
      </>
    )
  );
}

export default App;
