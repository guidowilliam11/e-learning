import CourseCard from '../../components/courseCard';

export default function Home() {
  const courses = [
    {
      logoSrc: '/path-to-logo1.png',
      title: 'Course Name 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      progress: 50,
      maxProgress: 100,
    },
    {
      logoSrc: '/path-to-logo2.png',
      title: 'Course Name 2',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      progress: 75,
      maxProgress: 100,
    },
    // Add more courses as needed
  ];

  return (
    <div className="p-8 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course, index) => (
        <CourseCard key={index} {...course} />
      ))}
    </div>
  );
}
