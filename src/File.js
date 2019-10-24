import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { useLazyQuery } from '@apollo/react-hooks';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import DownloadIcon from '@material-ui/icons/CloudDownload';

const Root = styled.div({
  padding: '1em',
});

const GET_LIST = gql`
  query GetList {
    getList
  }
`;

const GET_URL = gql`
  query GetUrl($filename: String, $filetype: String) {
    getUrl(filename: $filename, filetype: $filetype)
  }
`;

const GET_DOWNLOAD_URL = gql`
  query GetDownloadUrl($key: String) {
    getDownloadUrl(key: $key)
  }
`;

export default (props) => {
  const [file, setFile] = useState({});
  const [getPresignedUrl, { data = {} }] = useLazyQuery(GET_URL);
  const [getDownloadUrl, { data: downloadData = {} }] = useLazyQuery(GET_DOWNLOAD_URL);
  const onDrop = useCallback(acceptedFiles => {
    const accentedFile = acceptedFiles[0];

    getPresignedUrl({
      variables: {
        filename: accentedFile.name,
        filetype: accentedFile.type,
      },
    });

    setFile(accentedFile);
  }, []);

  const uploadFile = async () => {
    const options = {
      'Content-Type': file.type,
    };

    const result = await axios.put(data.getUrl, file, options);
    console.log(result);
  };

  useEffect(() => {
    if (!data.getUrl) return;
    console.log('data');
    console.log(data.getUrl);
    uploadFile();
  }, [data]);

  useEffect(() => {
    if (!downloadData.getDownloadUrl) return;
    console.log('data');
    console.log(downloadData.getDownloadUrl);
  }, [downloadData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const { loading, error, data: getListData = {} } = useQuery(GET_LIST, {
    fetchPolicy: 'network-only',
  });

  const handleDownload = (key) => () => {
    getDownloadUrl({ variables: { key }});
  };

  return (
    <Root>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <List>
        {getListData.getList &&
          getListData.getList.map(v => (
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={v.Key} secondary={v.Size} />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={handleDownload(v.Key)}>
                  <DownloadIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>
    </Root>
  );
};
