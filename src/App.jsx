import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
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
  useEffect(() => {
    async function fetchMovie() {
      const response = await fetch("https://jsonfakery.com/movies/random/");
      const data = await response.json();
      setMovie(data);
    }
    fetchMovie();
  }, []);
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
  };
  // Redux / IMMER
  const dispatch = useDispatch();
  const reviews = useSelector(selectReviews);

  return (
    movie && (
      <>
        <Container className="my-5">
          <Row className="w-50">
            <Col key={movie.movie_id}>
              <Card>
                <Card.Img
                  src={movie.poster_path}
                  alt={movie.original_title}
                ></Card.Img>
                <Card.Body>
                  <Card.Title>
                    <strong>{movie.original_title} </strong>
                  </Card.Title>
                  <Card.Text>Sortie : {movie.release_date}</Card.Text>
                  <Card.Text>{movie.overview}</Card.Text>
                  <Card.Text>
                    Note moyenne : {movie.vote_average} ({movie.vote_count}{" "}
                    votes)
                  </Card.Text>
                </Card.Body>
              </Card>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Label>
                  <strong> Commentaires </strong>
                </Form.Label>
                <Form.Group controlId="Comment">
                  <Form.Label>ajouter un commentaire</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    {...register("comment")}
                  />
                  <p>{errors.comment?.message}</p>
                </Form.Group>
                <Form.Group controlId="Note">
                  <Form.Label>Note</Form.Label>
                  <Form.Select {...register("note")}>
                    <option value="">Sélectionnez une note</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </Form.Select>
                  <p>{errors.note?.message}</p>
                </Form.Group>
                <Form.Group controlId="AcceptConditions">
                  <Form.Check
                    type="checkbox"
                    label="J'accepte les conditions générales"
                    {...register("acceptConditions")}
                  />
                  <p>{errors.acceptConditions?.message}</p>
                </Form.Group>
                <Button type="submit">Ajouter</Button>
              </Form>
              {reviews.length === 0 && (
                <Card.Text className="bg-info text-primary bg-opacity-25 rounded-sm mt-2 pl-50">
                  Aucun commentaire pour le moment.
                </Card.Text>
              )}
              {reviews.map((review) => (
                <Card className="mb-3 mt-4" key={review.id}>
                  <Row>
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <Col>
                        <Card.Text>
                          <strong>Note :</strong> {review.note}/5
                        </Card.Text>
                        <Card.Text>{review.text}</Card.Text>
                      </Col>
                      <Col className="d-flex justify-content-end">
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
