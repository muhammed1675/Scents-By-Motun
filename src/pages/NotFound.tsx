import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/ui/Loading';
import { Button } from '../components/ui/Button';

export function NotFound() {
  return (
    <div className="w-full bg-ivory">
      <PageHeader
        eyebrow="404"
        title="This page has drifted away"
        crumbs={[{ label: 'Not found' }]} />
      
      <div className="container py-14">
        <EmptyState
          title="We could not find that page"
          description="The link may be old, or the page may have moved. Try the shop instead."
          action={<Button to="/shop">Shop all products</Button>} />
        
      </div>
    </div>);

}