import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@heroui/react/button";
import { Form } from "@heroui/react/form";
import { Input } from "@heroui/react/input";
import { Label } from "@heroui/react/label";
import { TextField } from "@heroui/react/textfield";
import type { CreateProjectPayload, Project, UpdateProjectPayload } from "../../types/project";

type ProjectFormValues = {
  projectName: string;
  overview: string;
  myRole: string;
  teamSize: string;
  technologies: string;
  challenges: string;
  decisions: string;
  outcomes: string;
};

const emptyValues: ProjectFormValues = {
  projectName: "",
  overview: "",
  myRole: "",
  teamSize: "1",
  technologies: "",
  challenges: "",
  decisions: "",
  outcomes: "",
};

function fromProject(project: Project): ProjectFormValues {
  return {
    projectName: project.projectName,
    overview: project.overview,
    myRole: project.myRole,
    teamSize: String(project.teamSize),
    technologies: project.technologies,
    challenges: project.challenges,
    decisions: project.decisions,
    outcomes: project.outcomes,
  };
}

function toPayload(
  values: ProjectFormValues,
): Omit<CreateProjectPayload, "userId"> & UpdateProjectPayload {
  return {
    projectName: values.projectName.trim(),
    overview: values.overview.trim(),
    myRole: values.myRole.trim(),
    teamSize: Number(values.teamSize),
    technologies: values.technologies.trim(),
    challenges: values.challenges.trim(),
    decisions: values.decisions.trim(),
    outcomes: values.outcomes.trim(),
  };
}

const fieldClass =
  "mt-1 w-full rounded-[var(--lib-radius)] border border-[var(--lib-line)] bg-[var(--lib-paper-elevated)] px-3 py-2 text-sm text-[var(--lib-ink)]";

export function ProjectForm({
  initial,
  submitLabel,
  isPending,
  onSubmit,
  onCancel,
}: {
  initial?: Project;
  submitLabel: string;
  isPending?: boolean;
  onSubmit: (
    payload: Omit<CreateProjectPayload, "userId"> & UpdateProjectPayload,
  ) => void;
  onCancel?: () => void;
}) {
  const [values, setValues] = useState<ProjectFormValues>(
    initial ? fromProject(initial) : emptyValues,
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(toPayload(values));
  };

  const setField =
    (key: keyof ProjectFormValues) =>
    (value: string) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    };

  return (
    <Form onSubmit={handleSubmit} className="grid gap-3 text-left">
      <TextField
        value={values.projectName}
        onChange={setField("projectName")}
        isRequired
        isDisabled={isPending}
      >
        <Label className="text-xs text-[var(--lib-ink-muted)]">プロジェクト名</Label>
        <Input className="bg-[var(--lib-paper-elevated)] text-sm" />
      </TextField>

      <TextField
        value={values.myRole}
        onChange={setField("myRole")}
        isRequired
        isDisabled={isPending}
      >
        <Label className="text-xs text-[var(--lib-ink-muted)]">自分の役割</Label>
        <Input className="bg-[var(--lib-paper-elevated)] text-sm" />
      </TextField>

      <TextField
        value={values.teamSize}
        onChange={setField("teamSize")}
        isRequired
        isDisabled={isPending}
      >
        <Label className="text-xs text-[var(--lib-ink-muted)]">チーム規模（人数）</Label>
        <Input
          type="number"
          min={1}
          className="bg-[var(--lib-paper-elevated)] text-sm"
        />
      </TextField>

      {(
        [
          ["overview", "概要"],
          ["technologies", "使用技術"],
          ["challenges", "課題"],
          ["decisions", "工夫 / 意思決定"],
          ["outcomes", "成果"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="block text-left">
          <span className="text-xs text-[var(--lib-ink-muted)]">{label}</span>
          <textarea
            required
            rows={3}
            disabled={isPending}
            value={values[key]}
            onChange={(event) => {
              setField(key)(event.target.value);
            }}
            className={fieldClass}
          />
        </label>
      ))}

      <div className="mt-1 flex flex-wrap gap-2">
        <Button
          type="submit"
          size="sm"
          isPending={isPending}
          className="bg-[var(--lib-accent)] text-[var(--lib-accent-fg)]"
        >
          {submitLabel}
        </Button>
        {onCancel ? (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            isDisabled={isPending}
            onPress={onCancel}
          >
            キャンセル
          </Button>
        ) : null}
      </div>
    </Form>
  );
}
