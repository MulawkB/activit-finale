import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import "./App.css";
import { selectReviews } from "./redux/selectors";
import { addReviews } from "./redux/reviewsSlice";

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
      .max(500, "Le comentaire excéde la limite de 500 charactères"),
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
  };
  // Redux
  const [review, setReview] = useState("");
  const dispatch = useDispatch();
  const reviews = useSelector(selectReviews);
  const completedReviews = useSelector(selectCompletedReviews);

  const handleAddReview = () => {
    dispatch(addReviews(review));
    setReview("");
  };

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
                    onChange={(e) => setReview(e.target.value)}
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
                    onChange={(e) => setReview(e.target.value)}
                    {...register("acceptConditions")}
                  />
                  <p>{errors.acceptConditions?.message}</p>
                </Form.Group>
                <Button type="submit" onClick={handleAddReview}>
                  Ajouter
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </>
    )
  );
}

export default App;
