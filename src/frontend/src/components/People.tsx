import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import { IPeopleDocument } from "../../../backend/models/people";
import { useStoreActions, useStoreState } from "../store";
import Box from "./Box";

type PeopleSearchFormInputs = {
  name: string;
};

function Person({ person }: { person: IPeopleDocument }) {
  return (
    <Box className="my-2 p-4">
      <p className="text-lg font-semibold mb-2">{person.displayName}</p>
      <p>
        <span className="font-bold">Email: </span>
        {person.email}
      </p>
      <p>
        <span className="font-bold">Deparment: </span>
        {person.department}
      </p>
      <p>
        <span className="font-bold">Campus: </span>
        {person.campus}
      </p>
      <p>
        <span className="font-bold">Room: </span>
        {person.room}
      </p>
      <p>
        <span className="font-bold">Extension: </span>
        {person.extension}
      </p>
    </Box>
  );
}

interface IPeopleParams {
  name?: string;
}

function People() {
  const { name } = useParams<IPeopleParams>();

  const { register, handleSubmit } = useForm<PeopleSearchFormInputs>();

  const people = useStoreState((state) => state.people);
  const searchPeople = useStoreActions((actions) => actions.searchPeople);
  const setPeople = useStoreActions((actions) => actions.setPeople);

  const onSubmit: SubmitHandler<PeopleSearchFormInputs> = ({ name }) => {
    searchPeople({ nameInBanner: name });
  };

  useEffect(() => {
    if (name !== undefined) {
      searchPeople({ nameInBanner: name });
    } else {
      setPeople(undefined);
    }
  }, [name]);

  return (
    <div className="m-auto pt">
      <Box className="py-4 px-5 mb-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            name="name"
            placeholder="name"
            defaultValue={name}
            ref={register({ required: true })}
            className="w-full px-3 py-1 border mt-2 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
          <p className="text-sm font-light mt-1 italic">
            note: First letter of name, followed by last name
          </p>
          <input
            type="submit"
            value="Search"
            className="w-full py-0.5 mt-4 border bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
        </form>
      </Box>
      {people?.map((person) => (
        <Person key={person._id} person={person} />
      ))}
      {people !== undefined && people.length === 0 && <p>No results</p>}
    </div>
  );
}

export default People;
