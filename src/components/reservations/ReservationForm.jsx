// components/reservations/ReservationForm.jsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from '../../assets/ManageReservations.module.css';

const ReservationSchema = Yup.object().shape({
  firstName: Yup.string().required('El nombre es obligatorio'),
  lastName: Yup.string().required('El apellido es obligatorio'),
  phone: Yup.string().required('El teléfono es obligatorio'),
  email: Yup.string().email('Correo inválido').required('El correo es obligatorio'),
  checkIn: Yup.date().required('Fecha de entrada obligatoria'),
  checkOut: Yup.date().min(
    Yup.ref('checkIn'),
    'La fecha de salida debe ser posterior a la de entrada'
  ).required('Fecha de salida obligatoria'),
  roomNumber: Yup.string().required('La habitación es obligatoria'),
  guests: Yup.number().min(1, 'Debe haber al menos 1 huésped').required('Nº Huéspedes obligatorio'),
  notes: Yup.string(),
});

const ReservationForm = ({ reservation, handleSubmit, isEditing, formRef }) => {
  return (
    <Formik
      initialValues={reservation}
      validationSchema={ReservationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className={`card ${styles.form}`} ref={formRef}>
          <Field className={styles.input} type="text" name="firstName" placeholder="Nombre" />
          <ErrorMessage name="firstName" component="div" className={styles.error} />

          <Field className={styles.input} type="text" name="lastName" placeholder="Apellido" />
          <ErrorMessage name="lastName" component="div" className={styles.error} />

          <Field className={styles.input} type="tel" name="phone" placeholder="Teléfono" />
          <ErrorMessage name="phone" component="div" className={styles.error} />

          <Field className={styles.input} type="email" name="email" placeholder="Correo electrónico" />
          <ErrorMessage name="email" component="div" className={styles.error} />

          <Field className={styles.input} type="date" name="checkIn" />
          <ErrorMessage name="checkIn" component="div" className={styles.error} />

          <Field className={styles.input} type="date" name="checkOut" />
          <ErrorMessage name="checkOut" component="div" className={styles.error} />

          <Field className={styles.input} type="text" name="roomNumber" placeholder="Habitación" />
          <ErrorMessage name="roomNumber" component="div" className={styles.error} />

          <Field className={styles.input} type="number" name="guests" placeholder="Nº Huéspedes" min={1} />
          <ErrorMessage name="guests" component="div" className={styles.error} />

          <Field as="textarea" className={styles.input} name="notes" placeholder="Notas" />
          <ErrorMessage name="notes" component="div" className={styles.error} />

          <button className={styles.btn} type="submit" disabled={isSubmitting}>
            {isEditing ? 'Actualizar' : 'Crear'} Reserva
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ReservationForm;
