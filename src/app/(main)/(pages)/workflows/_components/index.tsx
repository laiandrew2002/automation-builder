/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import Workflow from './workflow'
// import { onGetWorkflows } from '../_actions/workflow-connections'
import MoreCredits from './more-credits'

type Props = {}

const Workflows = async (props: Props) => {
  // const workflows = await onGetWorkflows()
  const workflows = [
    {
      id: '123',
      description: 'abc',
      name: 'def',
      publish: true,
    }
  ]
  return (
    <div className="relative flex flex-col gap-4">
      <section className="flex flex-col m-2">
        <MoreCredits />
        {workflows?.length ? (
          workflows.map((flow: any) => (
            <Workflow
              key={flow.id}
              description={flow.description}
              name={flow.name}
              publish={flow.publish}
              id={flow.id}
            />
          ))
        ) : (
          <div className="mt-28 flex text-muted-foreground items-center justify-center">
            No Workflows
          </div>
        )}
      </section>
    </div>
  )
}

export default Workflows