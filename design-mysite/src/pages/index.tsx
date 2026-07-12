import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import DomainList from '@site/src/components/DomainList';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            設計ドキュメントを見る
          </Link>
        </div>
      </div>
    </header>
  );
}

function ProjectOverview() {
  return (
    <section className={styles.overview}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          プロジェクト概要
        </Heading>
        <p className={styles.overviewText}>
          自己プロフィール・技術スキル・読書記録・参画プロジェクト・自身のポートフォリオを<br />
          まとめたサイト。自分専用の管理画面を用意し、そこから随時更新を可能なものとする。<br />
          設計・技術的課題・ノートもここで管理する。
        </p>
      </div>
    </section>
  );
}

function QuickLinks() {
  const links = [
    {label: 'ドメイン設計', to: '/docs/category/ドメイン設計'},
    {label: '技術ノート', to: '/docs/tech/tech_index'},
  ];

  return (
    <section className={styles.quickLinks}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          クイックリンク
        </Heading>
        <div className={styles.quickLinksRow}>
          {links.map(({label, to}) => (
            <Link key={to} className="button button--outline button--primary" to={to}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="mysite プロジェクトの設計・DB・技術ノートを一元管理するドキュメントサイト">
      <HomepageHeader />
      <main>
        <ProjectOverview />
        <DomainList />
        <QuickLinks />
      </main>
    </Layout>
  );
}
