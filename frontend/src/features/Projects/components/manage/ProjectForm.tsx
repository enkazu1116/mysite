import { useState } from "react";
import type { SyntheticEvent } from "react";
import { Button } from "@heroui/react/button";
import { Form } from "@heroui/react/form";
import { Input } from "@heroui/react/input";
import { Label } from "@heroui/react/label";
import { TextField } from "@heroui/react/textfield";
import type { CreateProjectPayload, Project, UpdateProjectPayload } from "../../types/project";

type ProjectFormValues = {
  projectName: string;
  isHighlighted: boolean;
  startDate: string;
  endDate: string;
  description: string;
  myRole: string;
  teamSize: string;
  technologies: string;
  projectScale: string;
  challenges: string;
  decisions: string;
  outcomes: string;
  reflection: string;
};

const emptyValues: ProjectFormValues = {
  projectName: "",
  isHighlighted: false,
  startDate: "",
  endDate: "",
  description: "",
  myRole: "",
  teamSize: "1",
  technologies: "",
  projectScale: "",
  challenges: "",
  decisions: "",
  outcomes: "",
  reflection: "",
};

function fromProject(project: Project): ProjectFormValues {
  return {
    projectName: project.projectName,
    isHighlighted: project.isHighlighted,
    startDate: project.startDate ?? "",
    endDate: project.endDate ?? "",
    description: project.description,
    myRole: project.myRole,
    teamSize: String(project.teamSize),
    technologies: project.technologies,
    projectScale: project.projectScale,
    challenges: project.challenges,
    decisions: project.decisions,
    outcomes: project.outcomes,
    reflection: project.reflection,
  };
}

function toPayload(
  values: ProjectFormValues,
): Omit<CreateProjectPayload, "userId"> & UpdateProjectPayload {
  return {
    projectName: values.projectName.trim(),
    isHighlighted: values.isHighlighted,
    startDate: values.startDate || null,
    endDate: values.endDate || null,
    description: values.description.trim(),
    myRole: values.myRole.trim(),
    teamSize: Number(values.teamSize),
    technologies: values.technologies.trim(),
    projectScale: values.projectScale.trim(),
    challenges: values.challenges.trim(),
    decisions: values.decisions.trim(),
    outcomes: values.outcomes.trim(),
    reflection: values.reflection.trim(),
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

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
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

      <label className="flex items-center gap-2 text-sm text-[var(--lib-ink)]">
        <input
          type="checkbox"
          checked={values.isHighlighted}
          disabled={isPending}
          onChange={(event) => {
            setValues((prev) => ({ ...prev, isHighlighted: event.target.checked }));
          }}
        />
        ハイライト表示する
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-left">
          <span className="text-xs text-[var(--lib-ink-muted)]">適用開始日</span>
          <input
            type="date"
            value={values.startDate}
            disabled={isPending}
            onChange={(event) => {
              setField("startDate")(event.target.value);
            }}
            className={fieldClass}
          />
        </label>
        <label className="block text-left">
          <span className="text-xs text-[var(--lib-ink-muted)]">終了日</span>
          <input
            type="date"
            value={values.endDate}
            disabled={isPending}
            onChange={(event) => {
              setField("endDate")(event.target.value);
            }}
            className={fieldClass}
          />
        </label>
      </div>

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
          ["description", "説明"],
          ["technologies", "使用技術"],
          ["projectScale", "プロジェクト規模"],
          ["challenges", "課題"],
          ["decisions", "判断 / 意思決定"],
          ["outcomes", "成果"],
          ["reflection", "反省点"],
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
