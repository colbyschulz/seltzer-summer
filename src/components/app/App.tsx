import { Field, Form, Formik } from 'formik';
import React, { FC } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createRecord, getRecords } from '../../reactQuery/api';
import { queryKeys } from '../../reactQuery/queryKeys';
import { DistanceOption, TableRecord } from '../../types';

interface FormValues {
  firstName: string;
  lastName: string;
  minutes: string;
  seconds: string;
  distance: DistanceOption;
}

const App: FC = () => {
  const queryClient = useQueryClient();
  const { data: records, isLoading } = useQuery(queryKeys.records, () => getRecords());
  const { mutate: createRecordMutation, isLoading: createRecrodLoading } = useMutation(createRecord, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.records);
    },
  });

  const renderTable = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    const body = records.map(({ id, fields: { name, distance, time } }: TableRecord) => (
      <tr key={id}>
        <td>{name}</td>
        <td>{distance}</td>
        <td>{time}</td>
      </tr>
    ));

    return (
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Distance</td>
            <td>Time</td>
          </tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
    );
  };

  console.log(records);

  return (
    <div>
      Seltzer Summer
      {renderTable()}
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          minutes: '',
          seconds: '',
          distance: '',
        }}
        onSubmit={(values: FormValues, { resetForm }) => {
          console.log(values);
          const recordValues: TableRecord = {
            fields: {
              name: `${values.firstName} ${values.lastName}`,
              distance: values.distance || '5k',
              time: `${values.minutes}:${values.seconds}`,
            },
          };
          createRecordMutation(recordValues);
          resetForm();
        }}
      >
        <Form>
          <label htmlFor="firstName">First Name</label>
          <Field id="firstName" name="firstName" placeholder="Seltzer" />

          <label htmlFor="lastName">Last Name</label>
          <Field id="lastName" name="lastName" placeholder="Enthusiast" />

          <label htmlFor="minutes">Minutes</label>
          <Field id="minutes" name="minutes" pattern="[0-9]*" />

          <label htmlFor="seconds">Seconds</label>
          <Field id="seconds" name="seconds" pattern="[0-9]*" />

          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
};

export default App;
