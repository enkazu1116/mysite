enum SkillLevel {
    NeedsSupport = 1,
    WorksIndependently = 2,
    CanLeadImplementation = 3,
    CanDriveDesign = 4,
    CanGuideOrganization = 5,
}

const skillLevelLabels: Record<SkillLevel, string> = {
    [SkillLevel.NeedsSupport]: "周囲のサポートが必要",
    [SkillLevel.WorksIndependently]: "自立して作業可能",
    [SkillLevel.CanLeadImplementation]: "実装を主導できる",
    [SkillLevel.CanDriveDesign]: "設計を主導できる",
    [SkillLevel.CanGuideOrganization]: "組織やチームをリードできる",
};

export { SkillLevel, skillLevelLabels };
