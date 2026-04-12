import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUpload from '../FileUpload';

describe('FileUpload', () => {
  it('renders with label', () => {
    render(<FileUpload label="Upload PDF" file={null} onChange={() => {}} />);
    expect(screen.getByText('Upload PDF')).toBeInTheDocument();
  });

  it('shows "No file chosen" when no file selected', () => {
    render(<FileUpload label="File" file={null} onChange={() => {}} />);
    expect(screen.getByText('No file chosen')).toBeInTheDocument();
  });

  it('shows file name when file is selected', () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    render(<FileUpload label="File" file={file} onChange={() => {}} />);
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  it('shows existing file name when provided', () => {
    render(
      <FileUpload label="File" file={null} onChange={() => {}} existingFileName="old-file.pdf" />,
    );
    expect(screen.getByText('old-file.pdf')).toBeInTheDocument();
  });

  it('shows Remove button when file is selected', () => {
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    render(<FileUpload label="File" file={file} onChange={() => {}} />);
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });

  it('shows Remove button when existing file name is provided', () => {
    render(
      <FileUpload label="File" file={null} onChange={() => {}} existingFileName="old-file.pdf" />,
    );
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });

  it('does not show Remove button when no file', () => {
    render(<FileUpload label="File" file={null} onChange={() => {}} />);
    expect(screen.queryByText('Remove')).not.toBeInTheDocument();
  });

  it('calls onChange(null) when Remove is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    render(<FileUpload label="File" file={file} onChange={onChange} />);

    await user.click(screen.getByText('Remove'));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('shows max file size info', () => {
    render(<FileUpload label="File" file={null} onChange={() => {}} />);
    expect(screen.getByText('Max file size: 10MB')).toBeInTheDocument();
  });

  it('rejects files over 10MB', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<FileUpload label="File" file={null} onChange={onChange} />);

    // Create a file larger than 10MB
    const bigContent = new ArrayBuffer(11 * 1024 * 1024);
    const bigFile = new File([bigContent], 'huge.pdf', { type: 'application/pdf' });

    // Get the hidden file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, bigFile);

    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('too large'));
    expect(onChange).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it('accepts files under 10MB', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<FileUpload label="File" file={null} onChange={onChange} />);

    const smallFile = new File(['small content'], 'small.pdf', { type: 'application/pdf' });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(fileInput, smallFile);

    expect(onChange).toHaveBeenCalledWith(smallFile);
  });
});
