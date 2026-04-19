import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RichTextDisplay from '../RichTextDisplay';

describe('RichTextDisplay', () => {
  it('renders bold text from HTML', () => {
    const { container } = render(<RichTextDisplay html="<p><strong>Bold text</strong></p>" />);
    const strong = container.querySelector('strong');
    expect(strong).toBeInTheDocument();
    expect(strong).toHaveTextContent('Bold text');
  });

  it('renders a bullet list from HTML', () => {
    const { container } = render(
      <RichTextDisplay html="<ul><li>Item one</li><li>Item two</li></ul>" />,
    );
    const items = container.querySelectorAll('li');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Item one');
  });

  it('renders a link from HTML', () => {
    const { container } = render(
      <RichTextDisplay html='<p><a href="https://example.com">Click here</a></p>' />,
    );
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveTextContent('Click here');
  });

  it('strips <script> tags (DOMPurify sanitization)', () => {
    const { container } = render(
      <RichTextDisplay html='<p>Safe</p><script>alert("xss")</script>' />,
    );
    expect(container.querySelector('script')).not.toBeInTheDocument();
    expect(screen.getByText('Safe')).toBeInTheDocument();
  });

  it('strips onclick attributes (DOMPurify sanitization)', () => {
    const { container } = render(
      <RichTextDisplay html='<p onclick="alert(1)">Hello</p>' />,
    );
    const p = container.querySelector('p');
    expect(p).not.toHaveAttribute('onclick');
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders plain-text legacy value without corruption', () => {
    render(<RichTextDisplay html="No HTML tags here, just plain text." />);
    expect(screen.getByText('No HTML tags here, just plain text.')).toBeInTheDocument();
  });

  it('renders empty string without error', () => {
    const { container } = render(<RichTextDisplay html="" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <RichTextDisplay html="<p>Text</p>" className="my-custom-class" />,
    );
    expect(container.firstChild).toHaveClass('my-custom-class');
  });
});
