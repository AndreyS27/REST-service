using System.Data.SQLite;
public class StudentService
{
    private readonly string connectionString = "Data Source=students.db";

    public List<Student> SearchStudents(string? firstName, string? lastName, int? age,
        string? phoneNumber, string? major)
    {
        var students = new List<Student>();

        try
        {
            using var connection = new SQLiteConnection(connectionString);
            connection.Open();

            var command = connection.CreateCommand();

            command.CommandText = "SELECT * FROM student WHERE 1=1" +
                       " AND (first_name = @firstName OR @firstName IS NULL)" +
                       " AND (last_name = @lastName OR @lastName IS NULL)" +
                       " AND (age = @age OR @age IS NULL)" +
                       " AND (phone_number = @phoneNumber OR @phoneNumber IS NULL)" +
                       " AND (major = @major OR @major IS NULL)";

            command.Parameters.AddWithValue("@firstName", firstName);
            command.Parameters.AddWithValue("@lastName", lastName);
            command.Parameters.AddWithValue("@age", age);
            command.Parameters.AddWithValue("@phoneNumber", phoneNumber);
            command.Parameters.AddWithValue("@major", major);

            var reader = command.ExecuteReader();

            while (reader.Read())
            {
                students.Add(new Student
                {
                    Id = Convert.ToInt32(reader["id"]),
                    FirstName = reader["first_name"].ToString(),
                    LastName = reader["last_name"].ToString(),
                    Age = Convert.ToInt32(reader["age"]),
                    PhoneNumber = reader["phone_number"].ToString(),
                    Major = reader["major"].ToString()
                });
            }

        }
        catch (Exception ex)
        {
            Console.WriteLine("Ошибка при подключении к базе данных: " + ex.Message);
        }

        return students;
    }

    public bool AddStudent(string firstName, string lastName, int age,
        string phoneNumber, string major)
    {
        using var connection = new SQLiteConnection(connectionString);
        connection.Open();

        var command = connection.CreateCommand();
        string sql = "INSERT INTO student(first_name, last_name, age, phone_number, major) VALUES (@firstName, @lastName, @age, @phoneNumber, @major)";
        command.CommandText = sql;
        command.Parameters.AddWithValue("@firstName", firstName);
        command.Parameters.AddWithValue("@lastName", lastName);
        command.Parameters.AddWithValue("@age", age);
        command.Parameters.AddWithValue("@phoneNumber", phoneNumber);
        command.Parameters.AddWithValue("@major", major);

        return command.ExecuteNonQuery() > 0;
    }

    public bool DeleteStudent(int id)
    {
        using var connection = new SQLiteConnection(connectionString);
        connection.Open();

        var command = connection.CreateCommand();
        command.CommandText = "DELETE FROM student WHERE id = @id";
        command.Parameters.AddWithValue("id", id);

        return command.ExecuteNonQuery() > 0;
    }

    public bool UpdateStudent(int id, string firstName, string lastName, int age,
        string phoneNumber, string major)
    {
        using var connection = new SQLiteConnection(connectionString);
        connection.Open();

        var command = connection.CreateCommand();

        command.CommandText = @"
            UPDATE student 
            SET first_name = @firstName,
            last_name = @lastName,
            phone_number = @phoneNumber,
            age = @age,
            major = @major WHERE id = @id;
        ";

        command.Parameters.AddWithValue("@firstName", firstName);
        command.Parameters.AddWithValue("@lastName", lastName);
        command.Parameters.AddWithValue("@age", age);
        command.Parameters.AddWithValue("@phoneNumber", phoneNumber);
        command.Parameters.AddWithValue("@major", major);
        command.Parameters.AddWithValue("@id", id);

        return command.ExecuteNonQuery() > 0;
    }
}