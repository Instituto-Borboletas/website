import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { crudApi } from "../utils/api";

const InternalContext = createContext();

export function InternalProvider({ children }) {
  const { data: helps, isLoading: isHelpsLoading } = useQuery({
    queryKey: ["helps"],
    queryFn: () => crudApi.get("/helps")
  });

  const { data: helpKinds, isLoading: isHelpKindsLoading } = useQuery({
    queryKey: ["helpKinds"],
    queryFn: () => crudApi.get("/helps/kinds")
  });

  const { data: volunteers, isLoading: isVolunteersLoading } = useQuery({
    queryKey: ["volunteers"],
    queryFn: () => crudApi.get("/volunteers"),
  });
  const { data: volunteerKinds, isLoading: isVolunteerKindsLoading } = useQuery({
    queryKey: ["volunteerKinds"],
    queryFn: () => crudApi.get("/volunteers/kinds"),
  });

  const value = {
    helps,
    isHelpsLoading,
    helpKinds,
    isHelpKindsLoading,

    volunteers,
    isVolunteersLoading,
    volunteerKinds,
    isVolunteerKindsLoading,
  };

  return (
    <InternalContext.Provider value={value}>
      {children}
    </InternalContext.Provider>
  );
}

export function useInternalData() {
  return useContext(InternalContext);
}
