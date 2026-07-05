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
          自身の簡単な自己紹介と、参画してきたプロジェクトや読んできた本を紹介するサイト。
          静的なページではなく、自分専用のミニ CMS + 公開 API として運用する。
          設計・DB・技術的課題はすべてこのサイトで管理する。
        </p>
      </div>
    </section>
  );
}

function QuickLinks() {
  const links = [
    {label: 'DB設計', to: '/docs/category/db設計'},
    {label: '技術ノート', to: '/docs/category/技術ノート'},
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
