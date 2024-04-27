import React from 'react';
import {Flashbar} from '@cloudscape-design/components';

export function FlashNotification ({type, dismissible=true, content, id}) {
    return (
        <Flashbar
            items={[
              {
                type:type,
                dismissible:dismissible,
                content:content,
                id:id
              },
            ]}
          />
    )
}