/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react'
import { FileUploaderRegular } from '@uploadcare/react-uploader/next';
import '@uploadcare/react-uploader/core.css';

type Props = {
  onUpload: (e: string) => any;
}

const UploadCareButton = ({ onUpload }: Props) => {

  return (
    <div>
      <FileUploaderRegular
        sourceList="local, url, camera, dropbox"
        classNameUploader="uc-dark"
        pubkey="5044a298a174275b832a"
        onFileUploadSuccess={(e) => onUpload(e.cdnUrl)}
      />
    </div>
  )
}

export default UploadCareButton