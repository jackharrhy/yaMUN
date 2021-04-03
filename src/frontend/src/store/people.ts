import { action, Action, thunk, Thunk } from "easy-peasy";
import { toast } from "react-hot-toast";

import { IStore } from ".";
import { IPeopleDocument } from "../../../backend/models/people";
import { api, ErrorResponse } from "../api";

export interface IPeopleFields {
  people?: IPeopleDocument[];
  setPeople: Action<IStore, IPeopleDocument[] | undefined>;
  searchPeople: Thunk<IStore, { nameInBanner: string }>;
}

export const peopleFields: IPeopleFields = {
  people: undefined,
  setPeople: action((state, people) => {
    state.people = people;
  }),
  searchPeople: thunk(async (actions, { nameInBanner }) => {
    const params = new URLSearchParams({ nameInBanner });
    const resp = await api.peopleSearch(params);
    const json = await resp.json();

    if (resp.ok) {
      actions.setPeople(json as IPeopleDocument[]);
    } else {
      toast.error((json as ErrorResponse).error);
      actions.setPeople(undefined);
    }
  }),
};
