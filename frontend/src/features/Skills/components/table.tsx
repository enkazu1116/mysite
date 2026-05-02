import { useSkillsTable } from "../hooks/useSkillsTable";
import { useSkillsSuspenseQuery } from "../hooks/useSkillsSuspenseQuery";
import { Pagination } from "./Pagination";
import { SkillsTableView } from "./SkillsTableView";

export default function Table() {
  // const { skills, loading, error, fetchSkills } = useSkills();
  // const query = useSkillsQuery();
  const query = useSkillsSuspenseQuery();
  const { table } = useSkillsTable(query.skills ?? []);

  if (query.isLoading) {
    return <p>Loading...</p>;
  }

  if (query.error) {
    return (
      <div>
        <p>Error: {query.error?.message}</p>
        <button onClick={() => void query.refetch()}>Retry</button>
      </div>
    );
  }

  if (query.skills?.length === 0) {
    return <p>No skills found.</p>;
  }

  return <SkillsTableView table={table} footer={<Pagination table={table} />} />;
}