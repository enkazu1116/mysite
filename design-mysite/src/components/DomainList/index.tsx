import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type DomainStatus = 'done' | 'in-progress';

type DomainItem = {
  id: string;
  title: string;
  description: string;
  link: string;
  status: DomainStatus;
};

const domains: DomainItem[] = [
  {
    id: 'users',
    title: 'Users',
    description:
      'プロフィール・自己紹介文の管理。システム開発者向けのコアドメイン。',
    link: '/docs/design/users_domain_design',
    status: 'in-progress',
  },
  {
    id: 'books',
    title: 'Books',
    description:
      '書籍検索・読書状態（未読 / 読書中 / 読了）の管理。外部 API は backend で隠蔽。',
    link: '/docs/design/books_domain_design',
    status: 'done',
  },
  {
    id: 'skills',
    title: 'Skills',
    description:
      '技術スキル・経験月数・レベルの管理。ポートフォリオ公開用の読み取り API。',
    link: '/docs/design/skills_domain_design',
    status: 'in-progress',
  },
];

const statusLabels: Record<DomainStatus, string> = {
  done: '設計済',
  'in-progress': '設計中',
};

function DomainCard({title, description, link, status}: DomainItem) {
  return (
    <div className={clsx('col col--4', styles.domainCol)}>
      <Link to={link} className={styles.domainCard}>
        <div className={styles.cardHeader}>
          <Heading as="h3" className={styles.cardTitle}>
            {title}
          </Heading>
          <span
            className={clsx(styles.badge, {
              [styles.badgeDone]: status === 'done',
              [styles.badgeInProgress]: status === 'in-progress',
            })}>
            {statusLabels[status]}
          </span>
        </div>
        <p className={styles.cardDescription}>{description}</p>
        <span className={styles.cardLink}>設計を見る →</span>
      </Link>
    </div>
  );
}

export default function DomainList(): ReactNode {
  return (
    <section className={styles.domains}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          ドメイン一覧
        </Heading>
        <div className="row">
          {domains.map((domain) => (
            <DomainCard key={domain.id} {...domain} />
          ))}
        </div>
      </div>
    </section>
  );
}
